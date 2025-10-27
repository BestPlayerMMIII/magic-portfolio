export interface Metadata {
  createdAt: string;
  updatedAt: string;
  author: string;
  status: "draft" | "published" | "archived";
}

export type SchemaType =
  | "project"
  | "blog-post"
  | "work-in-progress"
  | "collaboration"
  | "learning-path"
  | "fun-fact";
export type NullableSchemaType = SchemaType | "";

export interface ContentItem<T> {
  id: string;
  schemaId: SchemaType;
  data: T;
  metadata: Metadata;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

export interface BlogPostHeader {
  title: string;
  excerpt: string;
  image: any;
  tags: string[];
}

export interface BlogPost {
  header: BlogPostHeader;
  content: string;
}

export interface WorkInProgress {
  title: string;
  description: string;
  progress: number; // 0-100
  technologies: string[];
  expectedCompletion?: string;
  priority: "low" | "medium" | "high";
}

export interface Collaboration {
  title: string;
  description: string;
  collaborators: string[];
  cStatus: "planning" | "active" | "completed" | "paused";
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface LearningPath {
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  progress: number; // 0-100
  resources: LearningResource[];
}

export interface LearningResource {
  title: string;
  type: "course" | "book" | "tutorial" | "documentation" | "video";
  url?: string;
  completed: boolean;
  notes?: string;
}

export interface FunFact {
  content: string;
  category: "personal" | "technical" | "random";
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Re-export 3D types for backwards compatibility
export type {
  InteractiveObject,
  SceneState,
  ObjectConfig,
  LightConfig,
  LightingConfiguration,
  ParticleSystemConfig,
  ParticlesConfiguration,
  AnimationConfig,
  TextConfig,
  LightingMode,
  SceneConfig,
} from "./3d";
