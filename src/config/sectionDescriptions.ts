import type { SchemaType } from "@/types";

export interface SectionDescription {
  id: SchemaType;
  title: string;
  emoji: string;
  description: string;
  longDescription: string;
  color: {
    from: string;
    to: string;
    accent: string;
  };
}

export const sectionDescriptions: Record<string, SectionDescription> = {
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
  },
};

/**
 * Get section description by schema ID
 */
export function getSectionDescription(
  schemaId: string
): SectionDescription | undefined {
  return sectionDescriptions[schemaId];
}

/**
 * Get all section descriptions as array
 */
export function getAllSectionDescriptions(): SectionDescription[] {
  return Object.values(sectionDescriptions);
}

/**
 * Convert contentType to schemaId format
 */
export function contentTypeToSchemaId(contentType: string): string {
  const mapping: Record<string, string> = {
    projects: "project",
    blog: "blog-post",
    wip: "work-in-progress",
    collaborations: "collaboration",
    learning: "learning-path",
    "fun-facts": "fun-fact",
  };
  return mapping[contentType] || contentType;
}

/**
 * Convert schemaId to contentType format
 */
export function schemaIdToContentType(schemaId: string): string {
  const mapping: Record<string, string> = {
    project: "projects",
    "blog-post": "blog",
    "work-in-progress": "wip",
    collaboration: "collaborations",
    "learning-path": "learning",
    "fun-fact": "fun-facts",
  };
  return mapping[schemaId] || schemaId;
}
