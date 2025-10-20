import { useCacheStore } from "../stores/cacheStore";
import type { ContentItem, SchemaType } from "@/types";

export interface ApiMethods {
  getPostsByCategory: <T = any>(category: string) => Promise<ContentItem<T>[]>;
  getAllCategories: () => Promise<
    Array<{ id: string; title: string; count: number; visible: boolean }>
  >;
}

export interface CacheManagerConfig {
  enableBackgroundRefresh: boolean;
  refreshInterval: number;
  maxRetries: number;
  retryDelay: number;
}

export class CacheManager {
  private config: CacheManagerConfig;
  private refreshTimers: Map<string, number> = new Map();
  private cacheStore: ReturnType<typeof useCacheStore> | null = null;
  private apiMethods: ApiMethods | null = null;

  constructor(config: Partial<CacheManagerConfig> = {}) {
    this.config = {
      enableBackgroundRefresh: true,
      refreshInterval: 30,
      maxRetries: 3,
      retryDelay: 5,
      ...config,
    };
  }

  private getCacheStore() {
    if (!this.cacheStore) {
      this.cacheStore = useCacheStore();
    }
    return this.cacheStore;
  }

  setApiMethods(apiMethods: ApiMethods): void {
    this.apiMethods = apiMethods;
  }

  async initialize(categoriesToPreload: SchemaType[] = []): Promise<void> {
    if (!this.apiMethods) {
      throw new Error("API methods not injected. Call setApiMethods() first.");
    }
    console.log("🚀 Initializing cache manager...");
    try {
      if (categoriesToPreload.length > 0) {
        await this.preloadCategories(categoriesToPreload);
      }
      if (this.config.enableBackgroundRefresh) {
        this.startBackgroundRefresh(categoriesToPreload);
      }
      console.log("✅ Cache manager initialized successfully");
    } catch (error) {
      console.error("❌ Cache manager initialization failed:", error);
      throw error;
    }
  }

  async preloadCategories(categoryIds: SchemaType[]): Promise<void> {
    const operations = categoryIds.map((id) => this.getByCategory(id));
    const results = await Promise.allSettled(operations);
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`[Cache] Preloaded ${categoryIds[index]}`);
      } else {
        console.warn(
          `[Cache] Failed to preload ${categoryIds[index]}:`,
          result.reason
        );
      }
    });
  }

  async getByCategory<T = any>(
    categoryId: SchemaType,
    forceRefresh = false
  ): Promise<ContentItem<T>[]> {
    if (!this.apiMethods) throw new Error("API methods not injected");
    return this.getCachedData(
      categoryId,
      () => this.apiMethods!.getPostsByCategory<T>(categoryId),
      forceRefresh
    );
  }

  async getAllCategories(
    forceRefresh = false
  ): Promise<
    Array<{ id: string; title: string; count: number; visible: boolean }>
  > {
    if (!this.apiMethods) throw new Error("API methods not injected");
    return this.getCachedData(
      "_categories",
      () => this.apiMethods!.getAllCategories(),
      forceRefresh
    );
  }

  private async getCachedData<T>(
    key: SchemaType | "_categories",
    fetchFunction: () => Promise<T>,
    forceRefresh = false
  ): Promise<T> {
    const cacheStore = this.getCacheStore();
    if (!forceRefresh) {
      const cached = cacheStore.getCacheEntry<T>(key);
      if (cached) {
        console.log(`[Cache] Using cached ${key}`);
        return cached;
      }
    }

    // Set loading state
    cacheStore.isLoading[key] = true;

    try {
      const data = await this.fetchWithRetry(fetchFunction);
      cacheStore.setCacheEntry(key, data);
      console.log(`[Cache] Fetched and cached ${key}`);
      return data;
    } catch (error) {
      console.error(`[Cache] Failed to fetch ${key}:`, error);
      const staleCache = cacheStore.getCacheEntry<T>(key);
      if (staleCache) {
        console.warn(`[Cache] Using stale cache for ${key}`);
        return staleCache;
      }
      throw error;
    } finally {
      cacheStore.isLoading[key] = false;
    }
  }

  private async fetchWithRetry<T>(
    fetchFunction: () => Promise<T>,
    attempt = 1
  ): Promise<T> {
    try {
      return await fetchFunction();
    } catch (error) {
      if (attempt < this.config.maxRetries) {
        console.warn(
          `[Cache] Fetch attempt ${attempt} failed, retrying in ${this.config.retryDelay}s...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, this.config.retryDelay * 1000)
        );
        return this.fetchWithRetry(fetchFunction, attempt + 1);
      }
      throw error;
    }
  }

  startBackgroundRefresh(categoryIds: SchemaType[] = []): void {
    const refreshMs = this.config.refreshInterval * 60 * 1000;
    const refreshData = async () => {
      console.log("🔄 Background refresh started");
      try {
        const operations = [
          this.getAllCategories(true),
          ...categoryIds.map((id) => this.getByCategory(id, true)),
        ];
        await Promise.allSettled(operations);
        console.log("✅ Background refresh completed");
      } catch (error) {
        console.warn("⚠️ Background refresh failed:", error);
      }
    };
    const timer = setInterval(refreshData, refreshMs) as unknown as number;
    this.refreshTimers.set("global", timer);
    console.log(
      `[Cache] Background refresh scheduled every ${this.config.refreshInterval} minutes`
    );
  }

  stopBackgroundRefresh(): void {
    this.refreshTimers.forEach((timer) => clearInterval(timer));
    this.refreshTimers.clear();
    console.log("🛑 Background refresh stopped");
  }

  clearCache(): void {
    this.getCacheStore().clearAllCache();
    console.log("🗑️ All cache cleared");
  }

  async refreshCategory(categoryId: SchemaType): Promise<void> {
    await this.getByCategory(categoryId, true);
  }

  destroy(): void {
    this.stopBackgroundRefresh();
    this.getCacheStore().clearAllCache();
    console.log("🗑️ Cache manager destroyed");
  }

  getCacheHealth() {
    return this.getCacheStore().cacheHealth;
  }

  getCacheStats() {
    return this.getCacheStore().cacheStats;
  }

  get isFullyCached() {
    return this.getCacheStore().isFullyCached;
  }
}

let cacheManagerInstance: CacheManager | null = null;

export const cacheManager = {
  getInstance(): CacheManager {
    if (!cacheManagerInstance) {
      cacheManagerInstance = new CacheManager();
    }
    return cacheManagerInstance;
  },
  setApiMethods(apiMethods: ApiMethods) {
    return this.getInstance().setApiMethods(apiMethods);
  },
  async initialize(categoriesToPreload: SchemaType[] = []) {
    return this.getInstance().initialize(categoriesToPreload);
  },
  async preloadCategories(categoryIds: SchemaType[]) {
    return this.getInstance().preloadCategories(categoryIds);
  },
  async getByCategory<T = any>(categoryId: SchemaType, forceRefresh = false) {
    return this.getInstance().getByCategory<T>(categoryId, forceRefresh);
  },
  async getAllCategories(forceRefresh = false) {
    return this.getInstance().getAllCategories(forceRefresh);
  },
  startBackgroundRefresh(categoryIds: SchemaType[] = []) {
    return this.getInstance().startBackgroundRefresh(categoryIds);
  },
  stopBackgroundRefresh() {
    return this.getInstance().stopBackgroundRefresh();
  },
  clearCache() {
    return this.getInstance().clearCache();
  },
  async refreshCategory(categoryId: SchemaType) {
    return this.getInstance().refreshCategory(categoryId);
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
