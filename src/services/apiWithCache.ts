import type {
  Project,
  BlogPost,
  Collaboration,
  FunFact,
  LearningPath,
  WorkInProgress,
  ContentItem,
} from "../types";
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
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn("🔄 ApiWithCache already initialized");
      return;
    }

    try {
      // Inject API methods into cache manager to avoid circular dependencies
      cacheManager.setApiMethods({
        getProjects: () => apiService.getProjects(),
        getBlogPosts: () => apiService.getBlogPosts(),
        getCollaborations: () => apiService.getCollaborations(),
        getFunFacts: () => apiService.getFunFacts(),
        getLearningPaths: () => apiService.getLearningPaths(),
        getWIPItems: () => apiService.getWIPItems(),
      });

      // Start background refresh
      cacheManager.startBackgroundRefresh();

      // Preload all data
      await cacheManager.preloadAllData();

      this.isInitialized = true;
      console.log("✅ Cache system initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize cache system:", error);
      throw error;
    }
  }

  /**
   * Get projects - cached or fresh
   */
  async getProjects(useCache = true): Promise<ContentItem<Project>[]> {
    if (useCache && this.isInitialized) {
      return cacheManager.getProjects();
    }
    return apiService.getProjects();
  }

  /**
   * Get blog posts - cached or fresh
   */
  async getBlogPosts(useCache = true): Promise<ContentItem<BlogPost>[]> {
    if (useCache && this.isInitialized) {
      return cacheManager.getBlogPosts();
    }
    return apiService.getBlogPosts();
  }

  /**
   * Get collaborations - cached or fresh
   */
  async getCollaborations(
    useCache = true
  ): Promise<ContentItem<Collaboration>[]> {
    if (useCache && this.isInitialized) {
      return cacheManager.getCollaborations();
    }
    return apiService.getCollaborations();
  }

  /**
   * Get fun facts - cached or fresh
   */
  async getFunFacts(useCache = true): Promise<ContentItem<FunFact>[]> {
    if (useCache && this.isInitialized) {
      return cacheManager.getFunFacts();
    }
    return apiService.getFunFacts();
  }

  /**
   * Get learning paths - cached or fresh
   */
  async getLearningPaths(
    useCache = true
  ): Promise<ContentItem<LearningPath>[]> {
    if (useCache && this.isInitialized) {
      return cacheManager.getLearningPaths();
    }
    return apiService.getLearningPaths();
  }

  /**
   * Get WIP projects - cached or fresh
   */
  async getWIPItems(useCache = true): Promise<ContentItem<WorkInProgress>[]> {
    if (useCache && this.isInitialized) {
      return cacheManager.getWipProjects();
    }
    return apiService.getWIPItems();
  }

  /**
   * Get post by type
   */
  async getByType(type: string, useCache = true): Promise<ContentItem<any>[]> {
    let content: ContentItem<any>[] = [];
    switch (type) {
      case "projects":
      case "project":
        content = await apiWithCache.getProjects(useCache);
        break;
      case "blog":
      case "blog-post":
        content = await apiWithCache.getBlogPosts(useCache);
        break;
      case "wip":
      case "work-in-progress":
        content = await apiWithCache.getWIPItems(useCache);
        break;
      case "collaborations":
      case "collaboration":
        content = await apiWithCache.getCollaborations(useCache);
        break;
      case "learning":
      case "learning-path":
        content = await apiWithCache.getLearningPaths(useCache);
        break;
      case "fun-facts":
      case "fun-fact":
        content = await apiWithCache.getFunFacts(useCache);
        break;
      default:
        throw new Error(`Unknown content type: ${type}`);
    }
    return content;
  }

  /**
   * Force refresh specific data type
   */
  async refreshData(
    type:
      | "projects"
      | "blogPosts"
      | "collaborations"
      | "funFacts"
      | "learningPaths"
      | "wipProjects"
  ): Promise<void> {
    if (!this.isInitialized) {
      throw new Error("Cache system not initialized");
    }
    return cacheManager.refreshData(type);
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
