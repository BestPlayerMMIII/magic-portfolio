import type {
  Project,
  BlogPost,
  WorkInProgress,
  Collaboration,
  LearningPath,
  FunFact,
  ApiResponse,
  ContentItem,
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
  async getProjects(): Promise<ContentItem<Project>[]> {
    return this.fetchApi<ContentItem<Project>[]>("/projects");
  }

  async getProjectById(id: string): Promise<ContentItem<Project>> {
    return this.fetchApi<ContentItem<Project>>(`/projects/${id}`);
  }

  // Blog Posts
  async getBlogPosts(): Promise<ContentItem<BlogPost>[]> {
    return this.fetchApi<ContentItem<BlogPost>[]>("/blog");
  }

  async getBlogPostById(id: string): Promise<ContentItem<BlogPost>> {
    return this.fetchApi<ContentItem<BlogPost>>(`/blog/${id}`);
  }

  async getBlogPostByIdFull(id: string): Promise<ContentItem<BlogPost>> {
    return this.fetchApi<ContentItem<BlogPost>>(`/blog/${id}/full`);
  }

  // Work in Progress
  async getWIPItems(): Promise<ContentItem<WorkInProgress>[]> {
    return this.fetchApi<ContentItem<WorkInProgress>[]>("/wip");
  }

  // Collaborations
  async getCollaborations(): Promise<ContentItem<Collaboration>[]> {
    return this.fetchApi<ContentItem<Collaboration>[]>("/collaborations");
  }

  // Learning Paths
  async getLearningPaths(): Promise<ContentItem<LearningPath>[]> {
    return this.fetchApi<ContentItem<LearningPath>[]>("/learning-path");
  }

  // Fun Facts
  async getFunFacts(): Promise<ContentItem<FunFact>[]> {
    return this.fetchApi<ContentItem<FunFact>[]>("/fun-facts");
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.fetchApi<{ status: string; timestamp: string }>("/health");
  }
}

export const apiService = new ApiService();
