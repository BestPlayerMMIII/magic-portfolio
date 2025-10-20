import {
  Project,
  BlogPost,
  WorkInProgress,
  Collaboration,
  LearningPath,
  FunFact,
  ContentItem,
} from "../types/index.js";
import {
  SchemaQuery,
  GitCMS,
  ContentItem as OriginalContentItem,
} from "@git-cms/client";

import dotenv from "dotenv";
dotenv.config();

export class DatabaseService {
  gitcms = new GitCMS({
    repository: process.env.GITCMS_REPOSITORY || "username/repo",
    branch: process.env.GITCMS_BRANCH || "main",
    token: process.env.GITCMS_TOKEN || "",
  });

  // ============================================
  // GENERIC METHODS (NEW - USE THESE)
  // ============================================

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

  // private helpers

  private getStandardAllQuery(collection: string): SchemaQuery {
    return this.gitcms
      .from(collection)
      .where("metadata.status", "==", "published")
      .orderBy("metadata.priority", "desc")
      .orderBy("metadata.publishedAt", "desc");
  }

  private normalizeAs<T>(item: OriginalContentItem): ContentItem<T> {
    return {
      id: item.id,
      schemaId: item.schemaId,
      data: item.data as T,
      metadata: item.metadata,
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

export const databaseService = new DatabaseService();
