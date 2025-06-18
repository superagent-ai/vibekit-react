import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { Agent, Project, GitHubRepository } from "./types";
import { useGitHubAuth } from "./hooks/use-github";

interface VibeKitContextProps {
  token: string;
  agent: Agent | null;
  project: Project | null;
  loading: boolean;
  error: string | null;
  githubToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  repositories: GitHubRepository[];
  login: (agentId: string) => Promise<void>;
  githubError: string | null;
}

export const VibeKitContext = createContext<VibeKitContextProps | undefined>(
  undefined
);

export const VibeKitProvider = ({
  token,
  children,
}: {
  token: string;
  children: ReactNode;
}) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    isAuthenticated,
    isLoading,
    repositories,
    token: githubToken,
    login,
    error: githubError,
  } = useGitHubAuth(token);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:3000/api/embed?agentId=${token}`
          //`https://app.vibekit.sh/api/embed?agentId=${token}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        setAgent(data.agent);
        setProject(data.project);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching data"
        );
        console.error("Error fetching agent and project data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <VibeKitContext.Provider
      value={{
        token,
        agent,
        project,
        loading,
        error,
        githubToken,
        isAuthenticated,
        isLoading,
        repositories,
        login,
        githubError,
      }}
    >
      {children}
    </VibeKitContext.Provider>
  );
};

export const useVibeKit = () => {
  const context = useContext(VibeKitContext);

  if (context === undefined) {
    throw new Error("useVibeKit must be used within a VibeKitProvider");
  }

  return context;
};
