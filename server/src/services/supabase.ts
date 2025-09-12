import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  Project,
  BlogPost,
  WorkInProgress,
  Collaboration,
  LearningPath,
  FunFact,
} from "../types/index.js";

class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Projects CRUD
  async getProjects(): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async createProject(
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<Project> {
    const { data, error } = await this.supabase
      .from("projects")
      .insert([project])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await this.supabase
      .from("projects")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // Blog Posts CRUD
  async getBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await this.supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getBlogPostById(id: string): Promise<BlogPost | null> {
    const { data, error } = await this.supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Work in Progress CRUD
  async getWIPItems(): Promise<WorkInProgress[]> {
    const { data, error } = await this.supabase
      .from("work_in_progress")
      .select("*")
      .order("priority", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Collaborations CRUD
  async getCollaborations(): Promise<Collaboration[]> {
    const { data, error } = await this.supabase
      .from("collaborations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Learning Paths CRUD
  async getLearningPaths(): Promise<LearningPath[]> {
    const { data, error } = await this.supabase
      .from("learning_paths")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Fun Facts CRUD
  async getFunFacts(): Promise<FunFact[]> {
    const { data, error } = await this.supabase
      .from("fun_facts")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const supabaseService = new SupabaseService();
