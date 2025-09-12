import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  BlogPost,
  Collaboration,
  FunFact,
  LearningPath,
  Project,
  WorkInProgress,
} from "../types";

// Cache entry with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

// Cache state for all portfolio data
interface CacheState {
  projects: CacheEntry<Project[]> | null;
  blogPosts: CacheEntry<BlogPost[]> | null;
  collaborations: CacheEntry<Collaboration[]> | null;
  funFacts: CacheEntry<FunFact[]> | null;
  learningPaths: CacheEntry<LearningPath[]> | null;
  wipProjects: CacheEntry<WorkInProgress[]> | null;
}

export const useCacheStore = defineStore("cache", () => {
  // Cache state
  const cache = ref<CacheState>({
    projects: null,
    blogPosts: null,
    collaborations: null,
    funFacts: null,
    learningPaths: null,
    wipProjects: null,
  });

  // Loading states
  const isLoading = ref({
    projects: false,
    blogPosts: false,
    collaborations: false,
    funFacts: false,
    learningPaths: false,
    wipProjects: false,
  });

  // Cache configuration
  const cacheTTL = {
    projects: 30 * 60 * 1000, // 30 minutes
    blogPosts: 15 * 60 * 1000, // 15 minutes
    collaborations: 60 * 60 * 1000, // 1 hour
    funFacts: 60 * 60 * 1000, // 1 hour
    learningPaths: 60 * 60 * 1000, // 1 hour
    wipProjects: 10 * 60 * 1000, // 10 minutes (more dynamic)
  };

  // Check if cache entry is valid
  function isCacheValid<T>(entry: CacheEntry<T> | null): boolean {
    if (!entry) return false;
    const now = Date.now();
    return now - entry.timestamp < entry.ttl;
  }

  // Set cache entry
  function setCacheEntry<T>(
    key: keyof CacheState,
    data: T,
    customTtl?: number
  ): void {
    const ttl = customTtl || cacheTTL[key];
    cache.value[key] = {
      data,
      timestamp: Date.now(),
      ttl,
    } as any;
  }

  // Get cache entry if valid
  function getCacheEntry<T>(key: keyof CacheState): T | null {
    const entry = cache.value[key] as CacheEntry<T> | null;
    if (!entry || !isCacheValid(entry)) {
      return null;
    }
    return entry.data;
  }

  // Clear specific cache entry
  function clearCacheEntry(key: keyof CacheState): void {
    cache.value[key] = null;
  }

  // Clear all cache
  function clearAllCache(): void {
    Object.keys(cache.value).forEach((key) => {
      cache.value[key as keyof CacheState] = null;
    });
  }

  // Get cache statistics
  const cacheStats = computed(() => {
    const stats: Record<
      string,
      { cached: boolean; age: number; expires: number }
    > = {};

    Object.entries(cache.value).forEach(([key, entry]) => {
      if (entry) {
        const age = Date.now() - entry.timestamp;
        const expires = entry.ttl - age;
        stats[key] = {
          cached: isCacheValid(entry as CacheEntry<any>),
          age: Math.round(age / 1000), // seconds
          expires: Math.round(Math.max(0, expires) / 1000), // seconds
        };
      } else {
        stats[key] = { cached: false, age: 0, expires: 0 };
      }
    });

    return stats;
  });

  // Check if all critical data is cached
  const isFullyCached = computed(() => {
    const criticalKeys: (keyof CacheState)[] = [
      "projects",
      "blogPosts",
      "collaborations",
      "funFacts",
    ];

    return criticalKeys.every((key) => {
      const entry = cache.value[key];
      return entry && isCacheValid(entry as CacheEntry<any>);
    });
  });

  // Get overall cache health
  const cacheHealth = computed(() => {
    const total = Object.keys(cache.value).length;
    const cached = Object.values(cacheStats.value).filter(
      (stat) => stat.cached
    ).length;
    return {
      percentage: Math.round((cached / total) * 100),
      cached,
      total,
    };
  });

  return {
    // State
    cache,
    isLoading,

    // Getters
    cacheStats,
    isFullyCached,
    cacheHealth,

    // Actions
    isCacheValid,
    setCacheEntry,
    getCacheEntry,
    clearCacheEntry,
    clearAllCache,
  };
});
