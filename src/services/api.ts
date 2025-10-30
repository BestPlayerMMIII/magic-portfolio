import type { ContentItem } from "../types";
import { databaseService } from "./database";
import { mediaService } from "./mediaService";
import {
  getCategoryById,
  getEnabledCategories,
  shouldShowCategory,
} from "@/config/categories";

/**
 * API Service for Frontend
 *
 * Now directly uses GitCMS client in public transport mode
 * instead of making HTTP requests to a backend API.
 *
 * This provides:
 * - Direct access to public GitHub repositories
 * - No backend server required
 * - Same interface as before for backward compatibility
 */
class ApiService {
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
    const categoryConfig = getCategoryById(category);

    if (!categoryConfig) {
      throw new Error(`Category '${category}' not found`);
    }

    if (!categoryConfig.enabled) {
      throw new Error(`Category '${category}' is disabled`);
    }

    // Fetch posts
    const posts = await databaseService.getBySchemaId<T>(category);

    // Process media if needed
    let processedPosts = posts;
    if (categoryConfig.hasMedia) {
      processedPosts = posts.map((post) =>
        mediaService.processContentFast(post)
      );
    }

    return processedPosts;
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
    const categoryConfig = getCategoryById(category);

    if (!categoryConfig) {
      throw new Error(`Category '${category}' not found`);
    }

    if (!categoryConfig.enabled) {
      throw new Error(`Category '${category}' is disabled`);
    }

    // Fetch post
    const post = await databaseService.getByIdAndSchemaId<T>(category, id);

    if (!post) {
      throw new Error(
        `Post with id '${id}' not found in category '${category}'`
      );
    } else {
      console.log(`Fetched post with id '${id}' in category '${category}'`);
    }

    // Process media if needed (fast version)
    let processedPost = post;
    if (categoryConfig.hasMedia) {
      processedPost = mediaService.processContentFast(post);
    }

    return processedPost;
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
    const categoryConfig = getCategoryById(category);

    if (!categoryConfig) {
      throw new Error(`Category '${category}' not found`);
    }

    if (!categoryConfig.enabled) {
      throw new Error(`Category '${category}' is disabled`);
    }

    // Fetch post
    const post = await databaseService.getByIdAndSchemaId<T>(category, id);

    if (!post) {
      throw new Error(
        `Post with id '${id}' not found in category '${category}'`
      );
    }

    // Process media if needed (full resolution)
    let processedPost = post;
    if (categoryConfig.hasMedia) {
      processedPost = await mediaService.processContentFull(post);
    }

    return processedPost;
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
    const enabledCategories = getEnabledCategories();

    const categoriesWithCounts = await Promise.all(
      enabledCategories.map(async (category) => {
        const items = await databaseService.getBySchemaId(category.id);
        const shouldShow = shouldShowCategory(category, items.length);

        return {
          ...category,
          count: items.length,
          visible: shouldShow,
        };
      })
    );

    return categoriesWithCounts;
  }

  /**
   * Health check (for backward compatibility)
   * @deprecated No longer needed without backend
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
    };
  }
}

export const apiService = new ApiService();
