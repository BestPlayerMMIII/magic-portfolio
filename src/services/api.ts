import type { ApiResponse, ContentItem } from "../types";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || "") + "/api";

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

  // ============================================
  // GENERIC METHODS (NEW - PREFERRED)
  // ============================================

  /**
   * Get all posts of a specific category
   * @param category - schemaId or apiPath (e.g., "project" or "projects")
   */
  async getPostsByCategory<T = any>(
    category: string
  ): Promise<ContentItem<T>[]> {
    return this.fetchApi<ContentItem<T>[]>(`/posts/${category}`);
  }

  /**
   * Get a single post by category and id
   * @param category - schemaId or apiPath
   * @param id - post id
   */
  async getPostById<T = any>(
    category: string,
    id: string
  ): Promise<ContentItem<T>> {
    const result = await this.fetchApi<ContentItem<T>[]>(
      `/posts/${category}/${id}`
    );
    return result[0];
  }

  /**
   * Get a single post with full resolution media
   * @param category - schemaId or apiPath
   * @param id - post id
   */
  async getPostByIdFull<T = any>(
    category: string,
    id: string
  ): Promise<ContentItem<T>> {
    const result = await this.fetchApi<ContentItem<T>[]>(
      `/posts/${category}/${id}/full`
    );
    return result[0];
  }

  /**
   * Get all categories with metadata
   */
  async getAllCategories(): Promise<
    Array<{
      id: string;
      title: string;
      count: number;
      visible: boolean;
    }>
  > {
    return this.fetchApi<any>("/posts");
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.fetchApi<{ status: string; timestamp: string }>("/health");
  }
}

export const apiService = new ApiService();
