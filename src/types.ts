export type Agent = {
  _id: string;
  name: string;
  descriptionText: string;
  headlineText: string;
  buttonText: string;
  logo: string;
  showButtonLogo: boolean;
  systemPrompt: string;
  primaryColor: string;
  projectId: string;
};

export type Project = {
  _id: string;
  logo: string;
  name: string;
  primaryColor: string;
  githubClientId: string;
  githubClientSecret: string;
};

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description?: string;
  html_url: string;
  default_branch: string;
  fork: boolean;
  permissions?: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
}

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name?: string;
  email?: string;
}

export interface GitHubAuth {
  isAuthenticated: boolean;
  user: GitHubUser | null;
  repositories: GitHubRepository[];
  isLoading: boolean;
  token: string | null;
  error: string | null;
  login: (agentId: string) => Promise<void>;
  logout: () => void;
  fetchRepositories: (token: string, agentId: string) => Promise<void>;
}
