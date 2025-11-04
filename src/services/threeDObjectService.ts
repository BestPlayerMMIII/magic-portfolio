import type { ContentItem, ThreeDObject } from "@/types";
import { databaseService } from "./database";

/**
 * Service for managing 3D objects from GitCMS
 * Fetches 3D model configurations and their URLs from the content repository
 */
class ThreeDObjectService {
  private _cache = new Map<string, ContentItem<ThreeDObject>>();
  private _allObjectsCache: ContentItem<ThreeDObject>[] | null = null;

  /**
   * Get all 3D objects from GitCMS
   */
  async getAll3DObjects(): Promise<ContentItem<ThreeDObject>[]> {
    if (this._allObjectsCache) {
      console.log("📦 Using cached 3D objects");
      return this._allObjectsCache;
    }

    console.log("🔄 Fetching 3D objects from GitCMS...");
    const objects = await databaseService.getBySchemaId<ThreeDObject>(
      "3d-object"
    );

    // Cache individual objects
    objects.forEach((obj) => {
      this._cache.set(obj.id, obj);
    });

    // Cache all objects
    this._allObjectsCache = objects;

    console.log(`✅ Loaded ${objects.length} 3D objects from GitCMS`);
    return objects;
  }

  /**
   * Get a single 3D object by ID
   */
  async get3DObjectById(id: string): Promise<ContentItem<ThreeDObject> | null> {
    // Check cache first
    if (this._cache.has(id)) {
      console.log(`📦 Using cached 3D object: ${id}`);
      return this._cache.get(id)!;
    }

    console.log(`🔄 Fetching 3D object from GitCMS: ${id}`);
    const object = await databaseService.getByIdAndSchemaId<ThreeDObject>(
      "3d-object",
      id
    );

    if (object) {
      this._cache.set(id, object);
      console.log(`✅ Loaded 3D object: ${id}`);
    } else {
      console.warn(`⚠️ 3D object not found: ${id}`);
    }

    return object;
  }

  /**
   * Get the model URL for a 3D object
   */
  async getModelUrl(id: string): Promise<string | null> {
    const object = await this.get3DObjectById(id);
    return object?.data.model.url || null;
  }

  /**
   * Get multiple 3D objects by IDs
   */
  async get3DObjectsByIds(
    ids: string[]
  ): Promise<Map<string, ContentItem<ThreeDObject>>> {
    const results = new Map<string, ContentItem<ThreeDObject>>();

    await Promise.all(
      ids.map(async (id) => {
        const object = await this.get3DObjectById(id);
        if (object) {
          results.set(id, object);
        }
      })
    );

    return results;
  }

  /**
   * Create a mapping of object IDs to their model URLs
   */
  async getModelUrlsMap(ids: string[]): Promise<Map<string, string>> {
    const objects = await this.get3DObjectsByIds(ids);
    const urlsMap = new Map<string, string>();

    objects.forEach((object, id) => {
      if (object.data.model.url) {
        urlsMap.set(id, object.data.model.url);
      }
    });

    return urlsMap;
  }

  /**
   * Preload all 3D objects into cache
   */
  async preloadAll(): Promise<void> {
    await this.getAll3DObjects();
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this._cache.clear();
    this._allObjectsCache = null;
    console.log("🗑️ 3D objects cache cleared");
  }

  /**
   * Get cache stats
   */
  getCacheStats(): {
    individualObjects: number;
    hasAllObjectsCache: boolean;
  } {
    return {
      individualObjects: this._cache.size,
      hasAllObjectsCache: this._allObjectsCache !== null,
    };
  }
}

/**
 * Singleton instance of the 3D object service
 */
export const threeDObjectService = new ThreeDObjectService();

/**
 * Default export for convenience
 */
export default threeDObjectService;
