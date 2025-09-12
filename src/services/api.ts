import type {
  Project,
  BlogPost,
  WorkInProgress,
  Collaboration,
  LearningPath,
  FunFact,
  ApiResponse,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

class ApiService {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<T> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "API request failed");
      }

      return data.data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.fetchApi<Project[]>("/projects");
  }

  async getProjectById(id: string): Promise<Project> {
    return this.fetchApi<Project>(`/projects/${id}`);
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return this.fetchApi<BlogPost[]>("/blog");
  }

  async getBlogPostById(id: string): Promise<BlogPost> {
    return this.fetchApi<BlogPost>(`/blog/${id}`);
  }

  // Work in Progress
  async getWIPItems(): Promise<WorkInProgress[]> {
    return this.fetchApi<WorkInProgress[]>("/wip");
  }

  // Collaborations
  async getCollaborations(): Promise<Collaboration[]> {
    return this.fetchApi<Collaboration[]>("/collaborations");
  }

  // Learning Paths
  async getLearningPaths(): Promise<LearningPath[]> {
    return this.fetchApi<LearningPath[]>("/learning-path");
  }

  // Fun Facts
  async getFunFacts(): Promise<FunFact[]> {
    return this.fetchApi<FunFact[]>("/fun-facts");
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.fetchApi<{ status: string; timestamp: string }>("/health");
  }
}

export const apiService = new ApiService();
