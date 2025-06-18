import React from "react";
import { createRoot } from "react-dom/client";
import { VibeKitProvider } from "./VibeKitProvider";
import { VibeKitButton } from "./VibeKitButton";
import "./style.css";

// Define the interface for the global VibeKit object
interface VibeKitConfig {
  agentId: string;
  element?: string | HTMLElement;
  [key: string]: any;
}

// Global VibeKit object
declare global {
  interface Window {
    VibeKit: {
      init: (config: VibeKitConfig) => void;
      render: (config: VibeKitConfig) => void;
    };
  }
}

// Main initialization function
const init = (config: VibeKitConfig) => {
  const { element = "#vibekit-button", agentId, ...providerProps } = config;

  // Find the target element
  const targetElement =
    typeof element === "string" ? document.querySelector(element) : element;

  if (!targetElement) {
    console.error("VibeKit: Target element not found:", element);
    return;
  }

  // Create React root and render
  const root = createRoot(targetElement);
  root.render(
    React.createElement(VibeKitProvider, {
      token: agentId,
      children: React.createElement(VibeKitButton),
      ...providerProps,
    })
  );
};

// Auto-initialize if config is found
const autoInit = () => {
  // Look for data attributes on script tag
  const scriptTag = document.querySelector(
    'script[src*="vibe-kit"], script[src*="vibekit"]'
  );
  if (scriptTag) {
    const agentId = scriptTag.getAttribute("data-agent-id");
    const element = scriptTag.getAttribute("data-element") || "#vibekit-button";

    if (agentId) {
      init({ agentId, element });
    }
  }

  // Also check for global config
  if (typeof window !== "undefined" && (window as any).VIBEKIT_CONFIG) {
    init((window as any).VIBEKIT_CONFIG);
  }
};

// Create the global VibeKit object
if (typeof window !== "undefined") {
  window.VibeKit = {
    init,
    render: init, // Alias for backwards compatibility
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }
}

export { init };
