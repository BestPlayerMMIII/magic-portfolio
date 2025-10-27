import type {
  SchemaQuery,
  ContentItem as GitCMSContentItem,
} from "@git-cms/client";
import { gitcms } from "./gitcms";
import type { ContentItem } from "@/types";

/**
 * Database Service for Frontend
 *
 * Provides access to GitCMS content directly from the frontend
 * using public transport mode (no backend needed).
 *
 * This service mirrors the backend DatabaseService but runs entirely
 * in the browser, accessing public GitHub repositories directly.
 */
export class DatabaseService {
  /**
   * Get all items by schemaId (generic method)
   */
  async getBySchemaId<T = any>(schemaId: string): Promise<ContentItem<T>[]> {
    return this.getAll<T>(schemaId);
  }

  /**
   * Get single item by schemaId and id (generic method)
   */
  async getByIdAndSchemaId<T = any>(
    schemaId: string,
    id: string
  ): Promise<ContentItem<T> | null> {
    return this.getById<T>(schemaId, id);
  }

  /**
   * Get content count for a specific schema
   */
  async getCountBySchemaId(schemaId: string): Promise<number> {
    const items = await this.getBySchemaId(schemaId);
    return items.length;
  }

  /**
   * Get counts for all categories
   */
  async getAllCategoryCounts(): Promise<Record<string, number>> {
    const schemas = [
      "project",
      "blog-post",
      "work-in-progress",
      "collaboration",
      "learning-path",
      "fun-fact",
    ];

    const counts: Record<string, number> = {};
    for (const schema of schemas) {
      counts[schema] = await this.getCountBySchemaId(schema);
    }
    return counts;
  }

  // Private helpers

  private getStandardAllQuery(collection: string): SchemaQuery {
    return gitcms
      .from(collection)
      .where("metadata.status", "==", "published")
      .orderBy("metadata.priority", "desc")
      .orderBy("metadata.publishedAt", "desc");
  }

  private normalizeAs<T>(item: GitCMSContentItem): ContentItem<T> {
    return {
      id: item.id,
      schemaId: item.schemaId as any,
      data: item.data as T,
      metadata: item.metadata as any,
    };
  }

  private async getClean<T>(query: SchemaQuery): Promise<ContentItem<T>[]> {
    const result = await query.debug(false).get();
    return result.map((item) => this.normalizeAs<T>(item));
  }

  private async getAll<T>(
    collection: string,
    queryModifier?: (query: SchemaQuery) => SchemaQuery
  ): Promise<ContentItem<T>[]> {
    let query = this.getStandardAllQuery(collection);
    if (queryModifier) {
      query = queryModifier(query);
    }
    return await this.getClean<T>(query);
  }

  private async getById<T>(
    collection: string,
    id: string,
    queryModifier?: (query: SchemaQuery) => SchemaQuery
  ): Promise<ContentItem<T> | null> {
    let query = this.getStandardAllQuery(collection)
      .where("id", "==", id)
      .limit(1);
    if (queryModifier) {
      query = queryModifier(query);
    }
    const result = await this.getClean<T>(query);
    return result.length > 0 ? result[0] : null;
  }
}

/**
 * Singleton instance of the database service
 */
export const databaseService = new DatabaseService();

/**
 * Default export for convenience
 */
export default databaseService;
