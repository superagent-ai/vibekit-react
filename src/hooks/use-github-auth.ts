"use client";

import { useState, useEffect } from "react";
import { GitHubRepository, GitHubUser } from "@/lib/github";

interface UseGitHubAuthReturn {
  isAuthenticated: boolean;
  user: GitHubUser | null;
  repositories: GitHubRepository[];
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  fetchRepositories: () => Promise<void>;
}

export function useGitHubAuth(): UseGitHubAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("github_user="));

        if (userCookie) {
          const userData = JSON.parse(
            decodeURIComponent(userCookie.split("=")[1])
          );

          // Verify the access token is still valid by making a test API call
          const response = await fetch("/api/auth/github/repositories");

          if (response.ok) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear cookies and auth state
            document.cookie =
              "github_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "github_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // Listen for auth success from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "GITHUB_AUTH_SUCCESS") {
        // Wait a bit for cookies to be set, then check auth status
        setTimeout(() => {
          // Instead of reloading the page, just check auth status again
          const userCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("github_user="));

          if (userCookie) {
            try {
              const userData = JSON.parse(
                decodeURIComponent(userCookie.split("=")[1])
              );
              setUser(userData);
              setIsAuthenticated(true);
              setIsLoading(false);
            } catch (error) {
              console.error("Error parsing user data:", error);
              setIsAuthenticated(false);
              setUser(null);
              setIsLoading(false);
            }
          }
        }, 1000);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const login = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Get the auth URL from our API
      const response = await fetch("/api/auth/github/url");
      const { url } = await response.json();

      // Open popup window for OAuth
      const popup = window.open(
        url,
        "github-oauth",
        "width=600,height=700,scrollbars=yes,resizable=yes"
      );

      // Check if popup was blocked
      if (!popup) {
        throw new Error("Popup blocked. Please allow popups for this site.");
      }

      // Wait for popup to close
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsLoading(false);
        }
      }, 1000);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Authentication failed"
      );
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Clear cookies
    document.cookie =
      "github_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "github_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setIsAuthenticated(false);
    setUser(null);
    setRepositories([]);
  };

  const fetchRepositories = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/github/repositories");

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      setRepositories(data.repositories || []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch repositories"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    user,
    repositories,
    isLoading,
    error,
    login,
    logout,
    fetchRepositories,
  };
}
