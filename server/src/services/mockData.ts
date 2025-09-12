import {
  Project,
  BlogPost,
  WorkInProgress,
  Collaboration,
  LearningPath,
  FunFact,
} from "../types/index.js";

// Mock Projects Data
export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Magic Portfolio",
    description:
      "An interactive 3D portfolio with magical elements and engaging animations built with Vue.js and Three.js",
    technologies: [
      "Vue.js",
      "Three.js",
      "TypeScript",
      "Node.js",
      "TailwindCSS",
    ],
    githubUrl: "https://github.com/yourname/magic-portfolio",
    liveUrl: "https://magic-portfolio.vercel.app",
    imageUrl: "/assets/projects/magic-portfolio.jpg",
    featured: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
  },
  {
    id: "2",
    title: "Task Manager Pro",
    description:
      "Collaborative task management app with real-time updates and intuitive interface",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Material-UI"],
    githubUrl: "https://github.com/yourname/task-manager-pro",
    liveUrl: "https://taskmanager-pro.demo.com",
    imageUrl: "/assets/projects/task-manager.jpg",
    featured: true,
    createdAt: "2023-11-20T09:15:00Z",
    updatedAt: "2023-12-01T16:30:00Z",
  },
  {
    id: "3",
    title: "Weather Wizard",
    description:
      "Elegant weather app with animated backgrounds that change based on weather conditions",
    technologies: ["React Native", "TypeScript", "OpenWeather API", "Expo"],
    githubUrl: "https://github.com/yourname/weather-wizard",
    imageUrl: "/assets/projects/weather-wizard.jpg",
    featured: false,
    createdAt: "2023-09-10T11:20:00Z",
    updatedAt: "2023-09-25T13:10:00Z",
  },
  {
    id: "4",
    title: "E-commerce Platform",
    description:
      "Complete e-commerce platform with payment integration, inventory management, and admin dashboard",
    technologies: ["Next.js", "Stripe", "PostgreSQL", "Prisma", "Vercel"],
    githubUrl: "https://github.com/yourname/ecommerce-platform",
    liveUrl: "https://shop-demo.vercel.app",
    imageUrl: "/assets/projects/ecommerce.jpg",
    featured: true,
    createdAt: "2023-07-05T08:45:00Z",
    updatedAt: "2023-08-12T17:20:00Z",
  },
];

// Mock Blog Posts Data
export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Create an Interactive 3D Portfolio with Vue.js and Three.js",
    content:
      "In this comprehensive guide, I'll show you how to create an immersive portfolio using Vue 3 and Three.js. We'll explore project setup, integrating 3D scenes, adding interactivity, and optimizing performance...",
    excerpt:
      "Discover how to create breathtaking 3D web experiences using Vue.js and Three.js",
    tags: ["Vue.js", "Three.js", "WebGL", "Portfolio", "3D"],
    published: true,
    publishedAt: "2024-01-10T14:30:00Z",
    createdAt: "2024-01-08T10:00:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
  },
  {
    id: "2",
    title: "The Magic of TypeScript: Why Every Developer Should Use It",
    content:
      "TypeScript has revolutionized the way I write JavaScript. In this article, I explore the advantages of TypeScript, how it improves the developer experience, and why you should consider making the switch...",
    excerpt:
      "Discover the benefits of TypeScript and how it can improve your development workflow",
    tags: ["TypeScript", "JavaScript", "Development", "Best Practices"],
    published: true,
    publishedAt: "2024-01-05T16:45:00Z",
    createdAt: "2024-01-03T09:30:00Z",
    updatedAt: "2024-01-05T16:45:00Z",
  },
  {
    id: "3",
    title: "Deploying Full-Stack Applications on Vercel",
    content:
      "Vercel makes deployment incredibly simple. Here is my complete guide to deploying full-stack applications, with backend APIs and frontend, using best practices...",
    excerpt: "A step-by-step guide to deploying your applications on Vercel",
    tags: ["Vercel", "Deployment", "DevOps", "Full-Stack"],
    published: true,
    publishedAt: "2023-12-28T12:15:00Z",
    createdAt: "2023-12-26T14:20:00Z",
    updatedAt: "2023-12-28T12:15:00Z",
  },
];

// Mock Work in Progress Data
export const mockWIP: WorkInProgress[] = [
  {
    id: "1",
    title: "AI-Powered Code Assistant",
    description:
      "Developing an intelligent coding assistant that helps with auto-completion and debugging using advanced AI models",
    progress: 75,
    technologies: ["Python", "OpenAI GPT", "FastAPI", "React", "WebSocket"],
    expectedCompletion: "2024-03-15",
    priority: "high",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  },
  {
    id: "2",
    title: "Real-time Collaboration Tool",
    description:
      "Figma-like collaboration tool for developers, with real-time editing and code sharing",
    progress: 45,
    technologies: ["Vue.js", "Socket.io", "Canvas API", "Node.js", "Redis"],
    expectedCompletion: "2024-05-01",
    priority: "medium",
    createdAt: "2023-12-15T10:00:00Z",
    updatedAt: "2024-01-18T11:45:00Z",
  },
  {
    id: "3",
    title: "Mobile App Portfolio",
    description:
      "Converting the web portfolio into a native mobile experience with optimized 3D animations",
    progress: 30,
    technologies: ["React Native", "Expo", "Three.js", "Reanimated"],
    expectedCompletion: "2024-04-10",
    priority: "medium",
    createdAt: "2024-01-10T12:30:00Z",
    updatedAt: "2024-01-19T09:15:00Z",
  },
  {
    id: "4",
    title: "Open Source UI Library",
    description:
      "Creating a complete and documented Vue.js component library for the community",
    progress: 60,
    technologies: ["Vue.js", "Storybook", "TypeScript", "Vite", "Vitest"],
    expectedCompletion: "2024-02-28",
    priority: "high",
    createdAt: "2023-11-20T14:00:00Z",
    updatedAt: "2024-01-21T16:20:00Z",
  },
];

// Mock Collaborations Data
export const mockCollaborations: Collaboration[] = []; // simulate empty data
/*
[
  {
    id: "1",
    title: "Green Tech Startup MVP",
    description:
      "Development of a sustainability tracking platform for small and medium enterprises",
    collaborators: ["Sarah Chen", "Mike Rodriguez", "Alex Kim"],
    status: "active",
    technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Chart.js"],
    githubUrl: "https://github.com/greentech/sustainability-tracker",
    createdAt: "2023-10-01T09:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    title: "Open Source Design System",
    description:
      "Contributing to a design system used by thousands of developers worldwide",
    collaborators: ["Design System Team", "Community Contributors"],
    status: "active",
    technologies: ["React", "TypeScript", "Storybook", "Figma", "CSS-in-JS"],
    githubUrl: "https://github.com/design-system/core",
    liveUrl: "https://design-system.dev",
    createdAt: "2023-08-15T11:30:00Z",
    updatedAt: "2024-01-19T10:15:00Z",
  },
  {
    id: "3",
    title: "Hackathon Winner - EduTech",
    description:
      "Educational platform that won first place at TechCrunch Disrupt, facilitating personalized learning",
    collaborators: ["Jenny Wilson", "David Park"],
    status: "completed",
    technologies: ["Vue.js", "Firebase", "Machine Learning", "PWA"],
    githubUrl: "https://github.com/edutech/learning-platform",
    liveUrl: "https://edutech-winner.app",
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2023-06-30T23:59:00Z",
  },
];*/

// Mock Learning Paths Data
export const mockLearningPaths: LearningPath[] = [
  {
    id: "1",
    title: "Advanced Three.js & WebGL",
    description:
      "Mastery of 3D graphics programming for the web with advanced rendering techniques",
    category: "Frontend Development",
    difficulty: "advanced",
    progress: 80,
    resources: [
      {
        id: "1",
        title: "Three.js Fundamentals",
        type: "course",
        url: "https://threejs-journey.com",
        completed: true,
        notes: "Excellent course for the basics",
      },
      {
        id: "2",
        title: "WebGL Programming Guide",
        type: "book",
        completed: true,
        notes: "Very detailed technical book",
      },
      {
        id: "3",
        title: "Shader Programming",
        type: "tutorial",
        url: "https://thebookofshaders.com",
        completed: false,
        notes: "In progress - very interesting",
      },
    ],
    createdAt: "2023-09-01T10:00:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "2",
    title: "Node.js Backend Architecture",
    description:
      "Learning scalable backend architectures and advanced design patterns",
    category: "Backend Development",
    difficulty: "intermediate",
    progress: 65,
    resources: [
      {
        id: "1",
        title: "Node.js Design Patterns",
        type: "book",
        completed: true,
        notes: "Great patterns for enterprise applications",
      },
      {
        id: "2",
        title: "Microservices with Node.js",
        type: "course",
        completed: true,
        notes: "Microservices architecture well explained",
      },
      {
        id: "3",
        title: "Database Design & Optimization",
        type: "course",
        completed: false,
        notes: "Still to be completed",
      },
    ],
    createdAt: "2023-10-15T09:30:00Z",
    updatedAt: "2024-01-12T11:45:00Z",
  },
];

// Mock Fun Facts Data
export const mockFunFacts: FunFact[] = [
  {
    id: "1",
    content:
      "I debugged a critical production issue while riding a roller coaster at an amusement park!",
    category: "personal",
    isActive: true,
    createdAt: "2024-01-01T12:00:00Z",
  },
  {
    id: "2",
    content:
      "My first 'Hello World' program was written on a Nokia 3310 by manipulating the Snake game score",
    category: "personal",
    isActive: true,
    createdAt: "2024-01-02T15:30:00Z",
  },
  {
    id: "3",
    content:
      "I can solve a Rubik's cube in under 2 minutes, which surprisingly helps with algorithmic thinking",
    category: "personal",
    isActive: true,
    createdAt: "2024-01-03T09:45:00Z",
  },
  {
    id: "4",
    content:
      "The longest time I've ever spent debugging: 8 hours, only to discover a missing semicolon in CSS",
    category: "technical",
    isActive: true,
    createdAt: "2024-01-04T14:20:00Z",
  },
  {
    id: "5",
    content:
      "I've contributed to 47 open source projects, but my most popular contribution was fixing a typo in documentation",
    category: "technical",
    isActive: true,
    createdAt: "2024-01-05T11:10:00Z",
  },
  {
    id: "6",
    content:
      "My editor theme changes based on time of day - dark mode after sunset, light during the day",
    category: "technical",
    isActive: true,
    createdAt: "2024-01-06T16:40:00Z",
  },
  {
    id: "7",
    content:
      "I once named all variables in a project after Harry Potter characters, and strangely it made the code more readable",
    category: "random",
    isActive: true,
    createdAt: "2024-01-07T13:25:00Z",
  },
  {
    id: "8",
    content:
      "My rubber duck debugging companion is actually a rubber dragon named 'Debuggon'",
    category: "random",
    isActive: true,
    createdAt: "2024-01-08T10:55:00Z",
  },
  {
    id: "9",
    content:
      "I learned to code because I wanted to automate Plants vs. Zombies gameplay",
    category: "random",
    isActive: true,
    createdAt: "2024-01-09T17:30:00Z",
  },
  {
    id: "10",
    content:
      "My most used keyboard shortcut is Ctrl+Z, closely followed by Ctrl+Shift+Z",
    category: "technical",
    isActive: true,
    createdAt: "2024-01-10T08:15:00Z",
  },
];
