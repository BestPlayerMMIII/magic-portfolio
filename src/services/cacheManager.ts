import { useCacheStore } from "../stores/cacheStore";
import type {
  Project,
  BlogPost,
  Collaboration,
  FunFact,
  LearningPath,
  WorkInProgress,
  ContentItem,
} from "../types";

// API function types for dependency injection
export interface ApiMethods {
  getProjects: () => Promise<ContentItem<Project>[]>;
  getBlogPosts: () => Promise<ContentItem<BlogPost>[]>;
  getCollaborations: () => Promise<ContentItem<Collaboration>[]>;
  getFunFacts: () => Promise<ContentItem<FunFact>[]>;
  getLearningPaths: () => Promise<ContentItem<LearningPath>[]>;
  getWIPItems: () => Promise<ContentItem<WorkInProgress>[]>;
}

export interface CacheManagerConfig {
  enableBackgroundRefresh: boolean;
  refreshInterval: number; // minutes
  maxRetries: number;
  retryDelay: number; // seconds
}

export class CacheManager {
  private config: CacheManagerConfig;
  private refreshTimers: Map<string, number> = new Map();
  private cacheStore: ReturnType<typeof useCacheStore> | null = null;
  private apiMethods: ApiMethods | null = null;

  constructor(config: Partial<CacheManagerConfig> = {}) {
    this.config = {
      enableBackgroundRefresh: true,
      refreshInterval: 30, // 30 minutes
      maxRetries: 3,
      retryDelay: 5, // 5 seconds
      ...config,
    };
  }

  /**
   * Get the cache store instance (lazy initialization)
   */
  private getCacheStore() {
    if (!this.cacheStore) {
      this.cacheStore = useCacheStore();
    }
    return this.cacheStore;
  }

  /**
   * Inject API methods to avoid circular dependency
   */
  setApiMethods(apiMethods: ApiMethods): void {
    this.apiMethods = apiMethods;
  }

  /**
   * Initialize cache manager and preload critical data
   */
  async initialize(): Promise<void> {
    if (!this.apiMethods) {
      throw new Error("API methods not injected. Call setApiMethods() first.");
    }

    console.log("🚀 Initializing cache manager...");

    try {
      // Preload critical data
      await this.preloadCriticalData();

      // Start background refresh if enabled
      if (this.config.enableBackgroundRefresh) {
        this.startBackgroundRefresh();
      }

      console.log("✅ Cache manager initialized successfully");
    } catch (error) {
      console.error("❌ Cache manager initialization failed:", error);
      throw error;
    }
  }

  /**
   * Preload all critical data for instant UX
   */
  async preloadCriticalData(): Promise<void> {
    const operations = [
      this.getProjects(),
      this.getBlogPosts(),
      this.getCollaborations(),
      this.getFunFacts(),
      this.getLearningPaths(),
      this.getWipProjects(),
    ];

    const results = await Promise.allSettled(operations);

    // Log results
    results.forEach((result, index) => {
      const names = [
        "projects",
        "blogPosts",
        "collaborations",
        "funFacts",
        "learningPaths",
        "wipProjects",
      ];
      if (result.status === "fulfilled") {
        console.log(`✅ Preloaded ${names[index]}`);
      } else {
        console.warn(`⚠️ Failed to preload ${names[index]}:`, result.reason);
      }
    });
  }

  /**
   * Get projects with cache-first strategy
   */
  async getProjects(forceRefresh = false): Promise<ContentItem<Project>[]> {
    if (!this.apiMethods) throw new Error("API methods not injected");
    return this.getCachedData(
      "projects",
      () => this.apiMethods!.getProjects(),
      forceRefresh
    );
  }

  /**
   * Get blog posts with cache-first strategy
   */
  async getBlogPosts(forceRefresh = false): Promise<ContentItem<BlogPost>[]> {
    if (!this.apiMethods) throw new Error("API methods not injected");
    return this.getCachedData(
      "blogPosts",
      () => this.apiMethods!.getBlogPosts(),
      forceRefresh
    );
  }

  /**
   * Get collaborations with cache-first strategy
   */
  async getCollaborations(
    forceRefresh = false
  ): Promise<ContentItem<Collaboration>[]> {
    if (!this.apiMethods) throw new Error("API methods not injected");
    return this.getCachedData(
      "collaborations",
      () => this.apiMethods!.getCollaborations(),
      forceRefresh
    );
  }

  /**
   * Get fun facts with cache-first strategy
   */
  async getFunFacts(forceRefresh = false): Promise<ContentItem<FunFact>[]> {
    if (!this.apiMethods) throw new Error("API methods not injected");
    return this.getCachedData(
      "funFacts",
      () => this.apiMethods!.getFunFacts(),
      forceRefresh
    );
  }

  /**
   * Get learning paths with cache-first strategy
   */
  async getLearningPaths(
    forceRefresh = false
  ): Promise<ContentItem<LearningPath>[]> {
    if (!this.apiMethods) throw new Error("API methods not injected");
    return this.getCachedData(
      "learningPaths",
      () => this.apiMethods!.getLearningPaths(),
      forceRefresh
    );
  }

  /**
   * Get WIP projects with cache-first strategy
   */
  async getWipProjects(
    forceRefresh = false
  ): Promise<ContentItem<WorkInProgress>[]> {
    if (!this.apiMethods) throw new Error("API methods not injected");
    return this.getCachedData(
      "wipProjects",
      () => this.apiMethods!.getWIPItems(),
      forceRefresh
    );
  }

  /**
   * Preload all data at app startup
   */
  async preloadAllData(): Promise<void> {
    if (!this.apiMethods) {
      throw new Error("API methods must be injected before preloading");
    }

    console.log("🚀 Starting data preload...");
    const startTime = Date.now();

    const preloadTasks = [
      this.getProjects(false),
      this.getBlogPosts(false),
      this.getCollaborations(false),
      this.getFunFacts(false),
      this.getLearningPaths(false),
      this.getWipProjects(false),
    ];

    try {
      await Promise.allSettled(preloadTasks);
      const duration = Date.now() - startTime;
      console.log(`✅ Data preload completed in ${duration}ms`);
    } catch (error) {
      console.error("❌ Error during data preload:", error);
      throw error;
    }
  }

  /**
   * Generic cache-first data fetching with retry logic
   */
  private async getCachedData<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    forceRefresh = false
  ): Promise<T> {
    const cacheStore = this.getCacheStore();

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh) {
      const cached = cacheStore.getCacheEntry<T>(key as any);
      if (cached) {
        console.log(`📦 Using cached ${key}`);
        return cached;
      }
    }

    // Set loading state
    cacheStore.isLoading[key as keyof typeof cacheStore.isLoading] = true;

    try {
      // Fetch fresh data with retry logic
      const data = await this.fetchWithRetry(fetchFunction);

      // Cache the data
      cacheStore.setCacheEntry(key as any, data);

      console.log(`🔄 Fetched and cached ${key}`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to fetch ${key}:`, error);

      // Try to return stale cache as fallback
      const staleCache = cacheStore.getCacheEntry<T>(key as any);
      if (staleCache) {
        console.warn(`📦 Using stale cache for ${key}`);
        return staleCache;
      }

      throw error;
    } finally {
      // Clear loading state
      cacheStore.isLoading[key as keyof typeof cacheStore.isLoading] = false;
    }
  }

  /**
   * Fetch with retry logic
   */
  private async fetchWithRetry<T>(
    fetchFunction: () => Promise<T>,
    attempt = 1
  ): Promise<T> {
    try {
      return await fetchFunction();
    } catch (error) {
      if (attempt < this.config.maxRetries) {
        console.warn(
          `⚠️ Fetch attempt ${attempt} failed, retrying in ${this.config.retryDelay}s...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, this.config.retryDelay * 1000)
        );

        return this.fetchWithRetry(fetchFunction, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Start background refresh for all cached data
   */
  startBackgroundRefresh(): void {
    const refreshMs = this.config.refreshInterval * 60 * 1000;

    const refreshData = async () => {
      console.log("🔄 Background refresh started");

      try {
        // Refresh all data silently
        await Promise.allSettled([
          this.getProjects(true),
          this.getBlogPosts(true),
          this.getCollaborations(true),
          this.getFunFacts(true),
          this.getLearningPaths(true),
          this.getWipProjects(true),
        ]);

        console.log("✅ Background refresh completed");
      } catch (error) {
        console.warn("⚠️ Background refresh failed:", error);
      }
    };

    // Set up refresh timer
    const timer = setInterval(refreshData, refreshMs) as unknown as number;
    this.refreshTimers.set("global", timer);

    console.log(
      `🔄 Background refresh scheduled every ${this.config.refreshInterval} minutes`
    );
  }

  /**
   * Stop background refresh
   */
  stopBackgroundRefresh(): void {
    this.refreshTimers.forEach((timer) => clearInterval(timer));
    this.refreshTimers.clear();
    console.log("🛑 Background refresh stopped");
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.getCacheStore().clearAllCache();
    console.log("🗑️ All cache cleared");
  }

  /**
   * Manually refresh specific data type
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
    switch (type) {
      case "projects":
        await this.getProjects(true);
        break;
      case "blogPosts":
        await this.getBlogPosts(true);
        break;
      case "collaborations":
        await this.getCollaborations(true);
        break;
      case "funFacts":
        await this.getFunFacts(true);
        break;
      case "learningPaths":
        await this.getLearningPaths(true);
        break;
      case "wipProjects":
        await this.getWipProjects(true);
        break;
    }
  }

  /**
   * Clear all caches and stop background refresh
   */
  destroy(): void {
    this.stopBackgroundRefresh();
    this.getCacheStore().clearAllCache();
    console.log("🗑️ Cache manager destroyed");
  }

  /**
   * Get cache health statistics
   */
  getCacheHealth() {
    return this.getCacheStore().cacheHealth;
  }

  /**
   * Get detailed cache statistics
   */
  getCacheStats() {
    return this.getCacheStore().cacheStats;
  }

  /**
   * Check if all critical data is cached
   */
  get isFullyCached() {
    return this.getCacheStore().isFullyCached;
  }
}

// Singleton instance - lazy initialization
let cacheManagerInstance: CacheManager | null = null;

export const cacheManager = {
  getInstance(): CacheManager {
    if (!cacheManagerInstance) {
      cacheManagerInstance = new CacheManager();
    }
    return cacheManagerInstance;
  },

  // Proxy all methods to the instance
  setApiMethods(apiMethods: ApiMethods) {
    return this.getInstance().setApiMethods(apiMethods);
  },

  async initialize() {
    return this.getInstance().initialize();
  },

  async preloadCriticalData() {
    return this.getInstance().preloadCriticalData();
  },

  async getProjects(forceRefresh = false) {
    return this.getInstance().getProjects(forceRefresh);
  },

  async getBlogPosts(forceRefresh = false) {
    return this.getInstance().getBlogPosts(forceRefresh);
  },

  async getCollaborations(forceRefresh = false) {
    return this.getInstance().getCollaborations(forceRefresh);
  },

  async getFunFacts(forceRefresh = false) {
    return this.getInstance().getFunFacts(forceRefresh);
  },

  async getLearningPaths(forceRefresh = false) {
    return this.getInstance().getLearningPaths(forceRefresh);
  },

  async getWipProjects(forceRefresh = false) {
    return this.getInstance().getWipProjects(forceRefresh);
  },

  async preloadAllData() {
    return this.getInstance().preloadAllData();
  },

  startBackgroundRefresh() {
    return this.getInstance().startBackgroundRefresh();
  },

  stopBackgroundRefresh() {
    return this.getInstance().stopBackgroundRefresh();
  },

  clearCache() {
    return this.getInstance().clearCache();
  },

  async refreshData(
    type:
      | "projects"
      | "blogPosts"
      | "collaborations"
      | "funFacts"
      | "learningPaths"
      | "wipProjects"
  ) {
    return this.getInstance().refreshData(type);
  },

  destroy() {
    return this.getInstance().destroy();
  },

  getCacheHealth() {
    return this.getInstance().getCacheHealth();
  },

  getCacheStats() {
    return this.getInstance().getCacheStats();
  },

  get isFullyCached() {
    return this.getInstance().isFullyCached;
  },
};
