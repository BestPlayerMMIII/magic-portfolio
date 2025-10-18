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

  // Projects CRUD
  async getProjects(): Promise<ContentItem<Project>[]> {
    return this.getAll<Project>("project");
  }
  async getProjectById(id: string): Promise<ContentItem<Project> | null> {
    return this.getById<Project>("project", id);
  }

  // Blog Posts CRUD
  async getBlogPosts(): Promise<ContentItem<BlogPost>[]> {
    return this.getAll<BlogPost>("blog-post");
  }
  async getBlogPostById(id: string): Promise<ContentItem<BlogPost> | null> {
    return this.getById<BlogPost>("blog-post", id);
  }

  // Work in Progress CRUD
  async getWIPItems(): Promise<ContentItem<WorkInProgress>[]> {
    return this.getAll<WorkInProgress>("work-in-progress");
  }
  async getWIPItemById(
    id: string
  ): Promise<ContentItem<WorkInProgress> | null> {
    return this.getById<WorkInProgress>("work-in-progress", id);
  }

  // Collaborations CRUD
  async getCollaborations(): Promise<ContentItem<Collaboration>[]> {
    return this.getAll<Collaboration>("collaboration");
  }
  async getCollaborationById(
    id: string
  ): Promise<ContentItem<Collaboration> | null> {
    return this.getById<Collaboration>("collaboration", id);
  }

  // Learning Paths CRUD
  async getLearningPaths(): Promise<ContentItem<LearningPath>[]> {
    return this.getAll<LearningPath>("learning-path");
  }
  async getLearningPathById(
    id: string
  ): Promise<ContentItem<LearningPath> | null> {
    return this.getById<LearningPath>("learning-path", id);
  }

  // Fun Facts CRUD
  async getFunFacts(): Promise<ContentItem<FunFact>[]> {
    return this.getAll<FunFact>("fun-fact");
  }

  async getRandomFunFact(): Promise<ContentItem<FunFact> | null> {
    const activeFacts = await this.getFunFacts();
    if (activeFacts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * activeFacts.length);
    return activeFacts[randomIndex];
  }

  async getFunFactsByCategory(
    category: "personal" | "technical" | "random"
  ): Promise<ContentItem<FunFact>[]> {
    return this.getAll<FunFact>("fun-fact", (query) =>
      query.where("category", "==", category)
    );
  }

  // Utility methods
  async getStats(): Promise<{
    projectsCount: number;
    blogPostsCount: number;
    wipItemsCount: number;
    collaborationsCount: number;
    learningPathsCount: number;
    funFactsCount: number;
  }> {
    return {
      projectsCount: (await this.getProjects()).length,
      blogPostsCount: (await this.getBlogPosts()).length,
      wipItemsCount: (await this.getWIPItems()).length,
      collaborationsCount: (await this.getCollaborations()).length,
      learningPathsCount: (await this.getLearningPaths()).length,
      funFactsCount: (await this.getFunFacts()).length,
    };
  }

  // private helpers

  private getStandardAllQuery(collection: string): SchemaQuery {
    return this.gitcms
      .from(collection)
      .where("metadata.status", "==", "published")
      .orderBy("createdAt", "desc");
  }

  private normalizeAs<T>(item: OriginalContentItem): ContentItem<T> {
    return {
      schemaId: item.schemaId,
      data: item.data as T,
      metadata: item.metadata,
    };
  }

  private async getAll<T>(
    collection: string,
    queryModifier?: (query: SchemaQuery) => SchemaQuery
  ): Promise<ContentItem<T>[]> {
    let query = this.getStandardAllQuery(collection);
    if (queryModifier) {
      query = queryModifier(query);
    }
    return (await query.get()).map((item) => this.normalizeAs<T>(item));
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
    const result = await query.get();
    if (result.length === 0) return null;
    return this.normalizeAs<T>(result[0]);
  }
}

export const databaseService = new DatabaseService();
