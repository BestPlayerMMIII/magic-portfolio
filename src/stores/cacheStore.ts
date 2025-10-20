import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { SchemaType } from "@/types";

// Cache entry with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export const useCacheStore = defineStore("cache", () => {
  // Generic cache state - supports any key
  const cache = ref<Record<string, CacheEntry<any>>>({});

  // Generic loading states
  const isLoading = ref<Record<string, boolean>>({});

  // Default cache TTL configuration by category
  const defaultTTL: Record<SchemaType | "_categories", number> = {
    project: 30 * 60 * 1000, // 30 minutes
    "blog-post": 15 * 60 * 1000, // 15 minutes
    collaboration: 60 * 60 * 1000, // 1 hour
    "fun-fact": 60 * 60 * 1000, // 1 hour
    "learning-path": 60 * 60 * 1000, // 1 hour
    "work-in-progress": 10 * 60 * 1000, // 10 minutes (more dynamic)
    _categories: 15 * 60 * 1000, // 15 minutes for categories list
  };

  // Fallback TTL for unknown keys
  const fallbackTTL = 30 * 60 * 1000; // 30 minutes

  // Check if cache entry is valid
  function isCacheValid<T>(entry: CacheEntry<T> | null): boolean {
    if (!entry) return false;
    const now = Date.now();
    return now - entry.timestamp < entry.ttl;
  }

  // Set cache entry
  function setCacheEntry<T>(
    key: SchemaType | "_categories",
    data: T,
    customTtl?: number
  ): void {
    const ttl = customTtl || defaultTTL[key] || fallbackTTL;
    cache.value[key] = {
      data,
      timestamp: Date.now(),
      ttl,
    };
  }

  // Get cache entry if valid
  function getCacheEntry<T>(key: string): T | null {
    const entry = cache.value[key] as CacheEntry<T> | undefined;
    if (!entry || !isCacheValid(entry)) {
      return null;
    }
    return entry.data;
  }

  // Clear specific cache entry
  function clearCacheEntry(key: string): void {
    delete cache.value[key];
  }

  // Clear all cache
  function clearAllCache(): void {
    cache.value = {};
    isLoading.value = {};
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
          cached: isCacheValid(entry),
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
    const criticalKeys = ["project", "blog-post", "collaboration", "fun-fact"];

    return criticalKeys.every((key) => {
      const entry = cache.value[key];
      return entry && isCacheValid(entry);
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
