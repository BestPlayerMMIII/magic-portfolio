/**
 * Centralized Category Configuration
 * Single source of truth for all post categories
 */

export type VisibilityRule = "always" | "hide-if-empty" | "never";

export interface CategoryConfig {
  // Identity
  id: string; // schemaId in GitCMS

  // Display
  title: string;
  emoji: string;
  description: string;
  longDescription: string;

  // Styling
  color: {
    from: string;
    to: string;
    accent: string;
  };

  // Behavior
  enabled: boolean; // Master switch
  visibility: VisibilityRule; // How to handle display
  order: number; // Display order

  // Media processing
  hasMedia: boolean; // Whether to process media fields
  mediaFields?: string[]; // Specific fields to process
}
const getEmptyCategoryConfig = (
  id: string,
  override?: Partial<CategoryConfig>
): CategoryConfig => ({
  title: "",
  emoji: "",
  description: "",
  longDescription: "",
  color: {
    from: "#000000",
    to: "#000000",
    accent: "#000000",
  },
  enabled: true,
  visibility: "never",
  order: 0,
  hasMedia: false,
  ...override,
  id,
});

/**
 * GitCMS schemas that are not standard categories,
 * but from which we may still want to fetch contents
 */
const otherSchemas: Record<string, CategoryConfig> = {
  html: getEmptyCategoryConfig("html", { hasMedia: true }),
};

/**
 * Master category registry
 * Add/remove/modify categories here
 */
export const categories: Record<string, CategoryConfig> = {
  ...otherSchemas,

  project: {
    id: "project",
    title: "Projects",
    emoji: "🔮",
    description: "Explore my magical creations",
    longDescription:
      "Welcome to my collection of projects! Here you'll find the applications, tools, and experiments I've crafted using various technologies. Each project represents a journey of learning and problem-solving.",
    color: {
      from: "#8b5cf6", // purple-500
      to: "#ec4899", // pink-500
      accent: "#a855f7", // purple-500
    },
    enabled: true,
    visibility: "always",
    order: 1,
    hasMedia: true,
  },

  "blog-post": {
    id: "blog-post",
    title: "Blog Posts",
    emoji: "📖",
    description: "Read my thoughts and experiences",
    longDescription:
      "Dive into my blog where I share insights, tutorials, and experiences from my journey in software development. From technical deep-dives to personal reflections, you'll find a variety of content here.",
    color: {
      from: "#d946ef", // fuchsia-500
      to: "#8b5cf6", // purple-500
      accent: "#e879f9", // fuchsia-400
    },
    enabled: true,
    visibility: "always",
    order: 2,
    hasMedia: true,
    mediaFields: ["header.image", "content"],
  },

  "work-in-progress": {
    id: "work-in-progress",
    title: "Work in Progress",
    emoji: "⚗️",
    description: "Peek at what I'm currently brewing",
    longDescription:
      "Get a sneak peek at the projects I'm currently working on! This section shows my ongoing experiments, upcoming features, and works in progress. Watch this space for updates as these ideas evolve.",
    color: {
      from: "#f59e0b", // amber-500
      to: "#ef4444", // red-500
      accent: "#fbbf24", // amber-400
    },
    enabled: true,
    visibility: "hide-if-empty",
    order: 3,
    hasMedia: true,
  },

  collaboration: {
    id: "collaboration",
    title: "Collaborations",
    emoji: "🤝",
    description: "Discover partnerships and team projects",
    longDescription:
      "Collaboration is at the heart of great software! Here you'll find projects I've worked on with other talented developers, designers, and creators. Together, we've built something greater than the sum of its parts.",
    color: {
      from: "#06b6d4", // cyan-500
      to: "#3b82f6", // blue-500
      accent: "#22d3ee", // cyan-400
    },
    enabled: true,
    visibility: "hide-if-empty",
    order: 4,
    hasMedia: true,
  },

  "learning-path": {
    id: "learning-path",
    title: "Learning Paths",
    emoji: "📚",
    description: "Follow my learning journey",
    longDescription:
      "Learning never stops! This section documents my ongoing education in various technologies, frameworks, and concepts. Track my progress as I explore new areas and deepen my expertise.",
    color: {
      from: "#10b981", // emerald-500
      to: "#14b8a6", // teal-500
      accent: "#34d399", // emerald-400
    },
    enabled: true,
    visibility: "hide-if-empty",
    order: 5,
    hasMedia: true,
  },

  "fun-fact": {
    id: "fun-fact",
    title: "Fun Facts",
    emoji: "🦉",
    description: "Discover interesting tidbits about me",
    longDescription:
      "Want to know more about me beyond the code? Here are some fun facts, quirks, and interesting things that make me who I am. From hobbies to random knowledge, it's all here!",
    color: {
      from: "#f43f5e", // rose-500
      to: "#ec4899", // pink-500
      accent: "#fb7185", // rose-400
    },
    enabled: true,
    visibility: "hide-if-empty",
    order: 6,
    hasMedia: false,
  },
};

/**
 * Get all enabled categories sorted by order
 */
export function getEnabledCategories(): CategoryConfig[] {
  return Object.values(categories)
    .filter((cat) => cat.enabled)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get category by ID (schemaId)
 */
export function getCategoryById(id: string): CategoryConfig | undefined {
  return categories[id];
}

/**
 * Check if a category should be visible based on content count
 */
export function shouldShowCategory(
  category: CategoryConfig,
  itemCount: number
): boolean {
  if (!category.enabled) return false;

  switch (category.visibility) {
    case "always":
      return true;
    case "never":
      return false;
    case "hide-if-empty":
      return itemCount > 0;
    default:
      return true;
  }
}
