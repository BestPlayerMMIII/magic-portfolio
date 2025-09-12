// Shared types matching backend
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkInProgress {
  id: string;
  title: string;
  description: string;
  progress: number;
  technologies: string[];
  expectedCompletion?: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export interface Collaboration {
  id: string;
  title: string;
  description: string;
  collaborators: string[];
  status: "planning" | "active" | "completed" | "paused";
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  progress: number;
  resources: LearningResource[];
  createdAt: string;
  updatedAt: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: "course" | "book" | "tutorial" | "documentation" | "video";
  url?: string;
  completed: boolean;
  notes?: string;
}

export interface FunFact {
  id: string;
  content: string;
  category: "personal" | "technical" | "random";
  isActive: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Three.js related types
export interface InteractiveObject {
  id: string;
  type: "crystal" | "cauldron" | "book" | "circle" | "library" | "owl";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  contentType:
    | "projects"
    | "wip"
    | "blog"
    | "collaborations"
    | "learning"
    | "fun-facts";
  isHovered: boolean;
  isClicked: boolean;
}

export interface SceneState {
  isLoading: boolean;
  selectedObject: InteractiveObject | null;
  hoveredObject: InteractiveObject | null;
  modalOpen: boolean;
  modalContent: any;
}
