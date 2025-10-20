import type { ContentItem, SchemaType } from "@/types";
import { cacheManager } from "./cacheManager";
import { apiService } from "./api";

/**
 * Cache-first API service that provides data from cache when available,
 * falling back to network requests when needed.
 *
 * This service acts as the main entry point for components to get data,
 * providing transparent caching without circular dependencies.
 */
class ApiWithCacheService {
  private isInitialized = false;

  /**
   * Initialize the cache system
   * Must be called once at app startup
   */
  async initialize(categoriesToPreload: SchemaType[] = []): Promise<void> {
    if (this.isInitialized) {
      console.warn("🔄 ApiWithCache already initialized");
      return;
    }

    try {
      // Inject API methods into cache manager to avoid circular dependencies
      cacheManager.setApiMethods({
        getPostsByCategory: (category: string) =>
          apiService.getPostsByCategory(category),
        getAllCategories: () => apiService.getAllCategories(),
      });

      // Initialize with preload categories
      await cacheManager.initialize(categoriesToPreload);

      this.isInitialized = true;
      console.log("✅ Cache system initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize cache system:", error);
      throw error;
    }
  }

  /**
   * Get posts by category - cached or fresh
   * @param categoryId - SchemaType ID (e.g., "project", "blog-post")
   */
  async getByCategory<T = any>(
    categoryId: SchemaType,
    useCache = true
  ): Promise<ContentItem<T>[]> {
    if (useCache && this.isInitialized) {
      return cacheManager.getByCategory<T>(categoryId);
    }
    return apiService.getPostsByCategory<T>(categoryId);
  }

  /**
   * Get all categories with metadata - cached or fresh
   */
  async getAllCategories(useCache = true): Promise<
    Array<{
      id: string;
      title: string;
      count: number;
      visible: boolean;
    }>
  > {
    if (useCache && this.isInitialized) {
      return cacheManager.getAllCategories();
    }
    return apiService.getAllCategories();
  }

  /**
   * Get single post by category and id (NEW)
   */
  async getPostById<T = any>(
    category: string,
    id: string
  ): Promise<ContentItem<T> | null> {
    try {
      return await apiService.getPostById<T>(category, id);
    } catch (error) {
      console.error(`Failed to get post ${id} from ${category}:`, error);
      return null;
    }
  }

  /**
   * Get single post with full media (NEW)
   */
  async getPostByIdFull<T = any>(
    category: string,
    id: string
  ): Promise<ContentItem<T> | null> {
    try {
      return await apiService.getPostByIdFull<T>(category, id);
    } catch (error) {
      console.error(`Failed to get full post ${id} from ${category}:`, error);
      return null;
    }
  }

  /**
   * Force refresh specific category
   */
  async refreshCategory(categoryId: SchemaType): Promise<void> {
    if (!this.isInitialized) {
      throw new Error("Cache system not initialized");
    }
    return cacheManager.refreshCategory(categoryId);
  }

  /**
   * Get cache statistics for debugging
   */
  getCacheStats() {
    return cacheManager.getCacheStats();
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    if (this.isInitialized) {
      cacheManager.clearCache();
    }
  }

  /**
   * Stop background refresh (useful for cleanup)
   */
  destroy(): void {
    if (this.isInitialized) {
      cacheManager.stopBackgroundRefresh();
      this.isInitialized = false;
      console.log("🛑 Cache system destroyed");
    }
  }
}

// Export singleton instance
export const apiWithCache = new ApiWithCacheService();

// Export for Vue components to use
export default apiWithCache;
