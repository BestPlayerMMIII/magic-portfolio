import {
  mockProjects,
  mockBlogPosts,
  mockWIP,
  mockCollaborations,
  mockLearningPaths,
  mockFunFacts,
} from "./mockData.js";
import {
  Project,
  BlogPost,
  WorkInProgress,
  Collaboration,
  LearningPath,
  FunFact,
} from "../types/index.js";

class MockService {
  // Simula un delay di rete realistico
  private async simulateNetworkDelay(min = 100, max = 500): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Projects CRUD
  async getProjects(): Promise<Project[]> {
    await this.simulateNetworkDelay();
    return [...mockProjects];
  }

  async getProjectById(id: string): Promise<Project | null> {
    await this.simulateNetworkDelay();
    const project = mockProjects.find((p) => p.id === id);
    return project || null;
  }

  async createProject(
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<Project> {
    await this.simulateNetworkDelay();

    const newProject: Project = {
      ...project,
      id: (mockProjects.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockProjects.push(newProject);
    return newProject;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    await this.simulateNetworkDelay();

    const index = mockProjects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }

    const updatedProject = {
      ...mockProjects[index],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    mockProjects[index] = updatedProject;
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    await this.simulateNetworkDelay();

    const index = mockProjects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }

    mockProjects.splice(index, 1);
  }

  // Blog Posts CRUD
  async getBlogPosts(): Promise<BlogPost[]> {
    await this.simulateNetworkDelay();
    return [...mockBlogPosts].filter((post) => post.published);
  }

  async getBlogPostById(id: string): Promise<BlogPost | null> {
    await this.simulateNetworkDelay();
    const post = mockBlogPosts.find((p) => p.id === id);
    return post || null;
  }

  async createBlogPost(
    post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
  ): Promise<BlogPost> {
    await this.simulateNetworkDelay();

    const newPost: BlogPost = {
      ...post,
      id: (mockBlogPosts.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockBlogPosts.push(newPost);
    return newPost;
  }

  // Work in Progress CRUD
  async getWIPItems(): Promise<WorkInProgress[]> {
    await this.simulateNetworkDelay();
    return [...mockWIP].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  async getWIPItemById(id: string): Promise<WorkInProgress | null> {
    await this.simulateNetworkDelay();
    const item = mockWIP.find((w) => w.id === id);
    return item || null;
  }

  async createWIPItem(
    item: Omit<WorkInProgress, "id" | "createdAt" | "updatedAt">
  ): Promise<WorkInProgress> {
    await this.simulateNetworkDelay();

    const newItem: WorkInProgress = {
      ...item,
      id: (mockWIP.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockWIP.push(newItem);
    return newItem;
  }

  // Collaborations CRUD
  async getCollaborations(): Promise<Collaboration[]> {
    await this.simulateNetworkDelay();
    return [...mockCollaborations];
  }

  async getCollaborationById(id: string): Promise<Collaboration | null> {
    await this.simulateNetworkDelay();
    const collaboration = mockCollaborations.find((c) => c.id === id);
    return collaboration || null;
  }

  // Learning Paths CRUD
  async getLearningPaths(): Promise<LearningPath[]> {
    await this.simulateNetworkDelay();
    return [...mockLearningPaths];
  }

  async getLearningPathById(id: string): Promise<LearningPath | null> {
    await this.simulateNetworkDelay();
    const path = mockLearningPaths.find((l) => l.id === id);
    return path || null;
  }

  async updateLearningPathProgress(
    id: string,
    progress: number
  ): Promise<LearningPath> {
    await this.simulateNetworkDelay();

    const index = mockLearningPaths.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error("Learning path not found");
    }

    const updatedPath = {
      ...mockLearningPaths[index],
      progress: Math.max(0, Math.min(100, progress)), // Ensure progress is between 0-100
      updatedAt: new Date().toISOString(),
    };

    mockLearningPaths[index] = updatedPath;
    return updatedPath;
  }

  // Fun Facts CRUD
  async getFunFacts(): Promise<FunFact[]> {
    await this.simulateNetworkDelay();
    return [...mockFunFacts].filter((fact) => fact.isActive);
  }

  async getRandomFunFact(): Promise<FunFact | null> {
    await this.simulateNetworkDelay();
    const activeFacts = mockFunFacts.filter((fact) => fact.isActive);
    if (activeFacts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * activeFacts.length);
    return activeFacts[randomIndex];
  }

  async getFunFactsByCategory(
    category: "personal" | "technical" | "random"
  ): Promise<FunFact[]> {
    await this.simulateNetworkDelay();
    return [...mockFunFacts].filter(
      (fact) => fact.isActive && fact.category === category
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
    await this.simulateNetworkDelay();

    return {
      projectsCount: mockProjects.length,
      blogPostsCount: mockBlogPosts.filter((p) => p.published).length,
      wipItemsCount: mockWIP.length,
      collaborationsCount: mockCollaborations.length,
      learningPathsCount: mockLearningPaths.length,
      funFactsCount: mockFunFacts.filter((f) => f.isActive).length,
    };
  }

  // Search functionality
  async searchContent(query: string): Promise<{
    projects: Project[];
    blogPosts: BlogPost[];
    wipItems: WorkInProgress[];
  }> {
    await this.simulateNetworkDelay();

    const searchTerm = query.toLowerCase();

    const projects = mockProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.technologies.some((tech) => tech.toLowerCase().includes(searchTerm))
    );

    const blogPosts = mockBlogPosts.filter(
      (p) =>
        p.published &&
        (p.title.toLowerCase().includes(searchTerm) ||
          p.content.toLowerCase().includes(searchTerm) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
    );

    const wipItems = mockWIP.filter(
      (w) =>
        w.title.toLowerCase().includes(searchTerm) ||
        w.description.toLowerCase().includes(searchTerm) ||
        w.technologies.some((tech) => tech.toLowerCase().includes(searchTerm))
    );

    return { projects, blogPosts, wipItems };
  }
}

export const mockService = new MockService();
