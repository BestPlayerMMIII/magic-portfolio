# 🔮 Magic Portfolio - Complete Documentation

> **An immersive 3D developer portfolio powered by Vue 3, Three.js, and GitCMS**

Transform your developer portfolio into an interactive magical laboratory where visitors explore your projects, blog posts, work-in-progress items, collaborations, learning paths, and fun facts through enchanted 3D objects.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Live Demo](#-live-demo)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Core Concepts](#-core-concepts)
- [Configuration](#-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Customization](#-customization)
- [API Reference](#-api-reference)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Credits](#-credits)
- [License](#-license)

---

## 🎯 Overview

**Magic Portfolio** is a frontend-only, serverless portfolio application that uses a **Git-based content management system** (GitCMS) to store and serve all your content directly from a GitHub repository. No database, no backend server required.

### What Makes It Special?

- **🎭 Interactive 3D Environment**: Navigate through a wizard laboratory with floating crystals, magic books, alchemy cauldrons, and more
- **📦 Serverless Architecture**: Everything runs in the browser - no backend needed
- **🔄 Git-Powered CMS**: Content stored in GitHub as markdown files with version control
- **🎨 Theme System**: Fully customizable themes with 3D objects, lighting, particles, and effects
- **📱 Responsive**: Works on desktop and mobile (with adaptive fallback for limited devices)
- **⚡ Fast & Cached**: Intelligent caching system with background refresh
- **🔧 TypeScript**: Full type safety throughout the application

---

## ✨ Key Features

### Content Categories

Each category is represented by a unique 3D object in the scene:

| Object              | Category             | Description                               |
| ------------------- | -------------------- | ----------------------------------------- |
| 💎 Floating Crystal | **Projects**         | Your completed projects and applications  |
| 📖 Mystical Book    | **Blog Posts**       | Articles, tutorials, and thoughts         |
| ⚗️ Alchemy Cauldron | **Work in Progress** | Ongoing experiments and upcoming features |
| 🤝 Magic Circle     | **Collaborations**   | Team projects and partnerships            |
| 📚 Glowing Library  | **Learning Paths**   | Educational journeys and courses          |
| 🦉 Animated Owl     | **Fun Facts**        | Personal tidbits and interesting facts    |

### Technical Highlights

- **Progressive Image Loading**: Thumbnails first, full resolution on demand
- **Smart Caching**: 5-minute cache with background refresh
- **3D Model Support**: GLB/GLTF models with animations
- **Day/Night Mode**: Toggle between light and dark themes
- **Particle Effects**: Customizable particle systems
- **Dynamic Lighting**: Multiple light types with configurable intensities
- **SEO Friendly**: Meta tags, Open Graph support
- **GitHub Actions**: Automated deployment to GitHub Pages

---

## 🌐 Live Demo

**[https://portfolio.bestplayer.dev/](https://portfolio.bestplayer.dev/)**

Experience the wizard laboratory theme in action!

---

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                         │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Vue 3 App (SPA)                                       │ │
│  │  ├── Router (Vue Router)                               │ │
│  │  ├── State Management (Pinia)                          │ │
│  │  └── UI Components                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                             ↕                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Services Layer                                        │ │
│  │  ├── API Service (content fetching)                    │ │
│  │  ├── Cache Manager (5min TTL + background refresh)     │ │
│  │  ├── Database Service (GitCMS wrapper)                 │ │
│  │  ├── Media Service (image processing)                  │ │
│  │  └── 3D Scene Manager (Three.js)                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                             ↕                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  GitCMS Client (@git-cms/client)                       │ │
│  │  - Public Transport Mode (no auth required)            │ │
│  │  - Direct GitHub API access                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
└──────────────────────────────┬──────────────────────────────┘
                               ↕
                        ┌───────────────┐
                        │  GitHub API   │
                        │  (Public)     │
                        └───────┬───────┘
                                ↕
                    ┌───────────────────────┐
                    │  Content Repository   │
                    │  (Markdown + Media)   │
                    └───────────────────────┘
```

### Data Flow

1. **User visits the app** → Vue app loads, initializes cache system
2. **Cache preloads content** → Fetches data from GitCMS for visible categories
3. **GitCMS queries GitHub** → Retrieves markdown files and metadata
4. **Media processing** → Images get thumbnail URLs for fast loading
5. **3D scene renders** → Three.js creates interactive objects
6. **User clicks object** → Opens modal with category content
7. **Background refresh** → Cache updates every 30 seconds silently

---

## 🔧 Tech Stack

### Frontend Framework

- **Vue 3.5+** - Progressive JavaScript framework with Composition API
- **TypeScript 5.2+** - Type-safe JavaScript
- **Vite 7+** - Lightning-fast build tool and dev server

### 3D Graphics

- **Three.js 0.157+** - WebGL 3D library
- **GLTFLoader** - 3D model loading (GLB/GLTF format)
- **OrbitControls** - Camera controls

### State & Routing

- **Vue Router 4.5+** - SPA routing with history mode
- **Pinia 3+** - Vue state management

### Styling

- **TailwindCSS 3.3+** - Utility-first CSS framework
- **@tailwindcss/typography** - Beautiful prose styling
- **Custom animations** - Float, glow, sparkle effects

### Content Management

- **@git-cms/client 0.1.0** - Git-based CMS client
- **GitHub API** - Direct repository access (public transport mode)

### Build & Development

- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS processing
- **Autoprefixer** - Vendor prefix automation

### Deployment

- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static hosting
- **Vercel** - Alternative deployment option

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required
Node.js 18+
npm or yarn
Git

# For custom content
GitHub account
GitCMS content repository
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/BestPlayerMMIII/magic-portfolio.git
cd magic-portfolio

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env with your GitCMS repository
# VITE_GITCMS_REPOSITORY=YOUR_USERNAME/your-content-repo
# VITE_GITCMS_BRANCH=main

# 5. Start development server
npm run dev
```

### First Run

Open `http://localhost:5173` and you'll see:

1. **Loading screen** - "Preparing the Magic Laboratory..."
2. **3D scene** - Interactive wizard laboratory
3. **Interactive objects** - Click crystals, books, etc. to view content
4. **Navigation** - Header with About, Day/Night toggle, Credits

---

## 📁 Project Structure

```
magic-portfolio/
├── 📁 public/                      # Static assets
│   ├── 404.html                    # GitHub Pages 404 handler
│   └── assets/
│       └── models/                 # 3D models (.glb files)
│
├── 📁 src/                         # Source code
│   ├── 📄 main.ts                  # App entry point
│   ├── 📄 App.vue                  # Root component
│   ├── 📄 style.css                # Global styles + Tailwind
│   │
│   ├── 📁 components/              # Reusable Vue components
│   │   ├── AppHeader.vue
│   │   ├── NavigationHeader.vue
│   │   ├── ContentModal.vue
│   │   ├── BackButton.vue
│   │   ├── posts/                  # Post detail components
│   │   │   ├── BlogPostDetail.vue
│   │   │   ├── ProjectDetail.vue
│   │   │   ├── WIPDetail.vue
│   │   │   ├── CollaborationDetail.vue
│   │   │   ├── LearningPathDetail.vue
│   │   │   └── FunFactDetail.vue
│   │   └── sections/               # Section list components
│   │       ├── BlogPostsList.vue
│   │       ├── ProjectsList.vue
│   │       └── ...
│   │
│   ├── 📁 scenes/                  # Main views/scenes
│   │   ├── MagicPortfolio.vue      # Main 3D scene
│   │   ├── About.vue               # About page
│   │   ├── Post.vue                # Single post view
│   │   ├── PostSection.vue         # Category list view
│   │   └── index.ts
│   │
│   ├── 📁 services/                # Business logic
│   │   ├── api.ts                  # API service (GitCMS wrapper)
│   │   ├── apiWithCache.ts         # Cached API layer
│   │   ├── cacheManager.ts         # Cache management
│   │   ├── database.ts             # Database service (GitCMS queries)
│   │   ├── gitcms.ts               # GitCMS client initialization
│   │   ├── mediaService.ts         # Image/media processing
│   │   ├── interactiveObjectsInfo.ts
│   │   └── core/                   # 3D scene core logic
│   │       ├── SceneManager.ts     # Main scene orchestrator
│   │       ├── ObjectManager.ts    # 3D object creation/management
│   │       ├── LightingManager.ts  # Lighting setup
│   │       ├── ParticleManager.ts  # Particle systems
│   │       └── ...
│   │
│   ├── 📁 stores/                  # Pinia state stores
│   │   ├── cacheStore.ts           # Cache state
│   │   └── viewModeStore.ts        # Day/night mode
│   │
│   ├── 📁 router/                  # Vue Router configuration
│   │   └── index.ts
│   │
│   ├── 📁 config/                  # Configuration files
│   │   ├── categories.ts           # Category definitions
│   │   ├── sectionDescriptions.ts  # Section metadata
│   │   └── sectionIcons.ts
│   │
│   ├── 📁 themes/                  # Theme system
│   │   ├── index.ts                # Theme registry
│   │   └── wizard-lab/             # Default theme
│   │       ├── index.ts
│   │       └── config/
│   │           ├── objects.ts      # 3D object configs
│   │           ├── lighting.ts     # Light configs
│   │           ├── particles.ts    # Particle configs
│   │           ├── scene.ts        # Scene settings
│   │           └── effects.ts      # Effect presets
│   │
│   ├── 📁 types/                   # TypeScript type definitions
│   │   ├── index.ts                # Main types
│   │   ├── global.ts               # Global types
│   │   └── 3d/
│   │       └── index.ts            # 3D-specific types
│   │
│   ├── 📁 utils/                   # Utility functions
│   │   └── deviceDetection.ts
│   │
│   └── 📁 styles/                  # Additional styles
│       └── ui-interactions.css
│
├── 📁 docs/                        # User documentation
│   ├── GETTING-STARTED.md
│   └── CREATING-THEMES.md
│
├── 📁 docs-legacy/                 # Development notes (outdated)
│
├── 📁 .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment
│
├── 📄 package.json                 # Dependencies & scripts
├── 📄 vite.config.ts               # Vite configuration
├── 📄 tailwind.config.js           # Tailwind configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 vercel.json                  # Vercel deployment config
├── 📄 .env.example                 # Environment variables template
├── 📄 index.html                   # HTML entry point
├── 📄 README.md                    # Brief overview
├── 📄 CONTRIBUTING.md              # Contribution guidelines
└── 📄 LICENSE                      # MIT License
```

---

## 🧩 Core Concepts

### 1. GitCMS Integration

**GitCMS** is a custom Git-based content management system that stores content as markdown files in a GitHub repository.

#### How It Works

```
Content Repository Structure:
my-portfolio-content/
├── .gitcms/schemas/              # GitCMS schema definition
│   ├── project.json
│   ├── blog-post.json
|   | . . .
│   └── fun-facts.json
└── contents/                     # GitCMS content
    ├── project/
    │   ├── project-1.json
    │   └── project-2.json
    ├── blog-post/
    │   └── my-first-post.json
    | . . .
    └── fun-facts/
```

#### Content Item Structure

Each json file is structured based on its schema definition!

#### Public Transport Mode

The app uses **public transport mode** which means:

- ✅ No GitHub authentication token required
- ✅ Works with public repositories
- ✅ Direct browser-to-GitHub API calls
- ⚠️ Rate limited to 60 requests/hour (unauthenticated)
- 💡 Add `GITCMS_TOKEN` for 5000 requests/hour

### 2. Cache System

**Smart caching** reduces API calls and improves performance.

#### Cache Strategy

```typescript
Cache Configuration:
- TTL: 5 minutes (data considered fresh)
- Background Refresh: Every 30 seconds
- Preload: Enabled categories on app init
- Storage: In-memory (Pinia store)
```

#### Cache Flow

```
User Request
    ↓
Check Cache (useCacheStore)
    ↓
Is Fresh? (< 5min old)
    ├─ YES → Return cached data
    └─ NO  → Fetch from GitCMS
              ↓
         Update cache
              ↓
         Return fresh data
```

#### Background Refresh

```typescript
// Automatic refresh every 30 seconds (configurable)
setInterval(() => {
  // Silently update cache in background
  // User sees no loading state
}, 30000);
```

### 3. Theme System

Themes control the entire visual experience.

#### Theme Structure

```typescript
interface ThemeConfig {
  name: string;
  objects: ObjectConfig[]; // 3D objects in scene
  lighting: LightingConfiguration; // Lights
  particles: ParticlesConfiguration; // Particle effects
  scene: SceneConfig; // Camera, fog, background
  metadata: ThemeMetadata; // Theme info
}
```

#### Object Configuration

```typescript
{
  type: "crystal",                // Object type identifier
  contentType: "project",         // Links to content category
  modelPath: "assets/models/crystal.glb",
  position: [0, 3, -1],          // [x, y, z] coordinates
  rotation: [0, 0, 0],           // [x, y, z] radians
  scale: 0.002,                   // Size multiplier
  animation: {
    floating: {
      enabled: true,
      amplitude: 0.15,            // Float height
      speed: 1.0                  // Float speed
    },
    rotation: {
      enabled: true,
      speed: 0.005                // Rotation speed
    },
    hover: {
      scaleMultiplier: 1.1        // Size on hover
    },
    glb: {
      playOnHover: true,          // Play model animation
      loop: true,
      speed: 1.0
    }
  }
}
```

### 4. Category System

Categories are the content types in your portfolio.

#### Category Configuration

Defined in `src/config/categories.ts`:

```typescript
{
  id: "project",              // Schema ID in GitCMS
  title: "Projects",          // Display name
  emoji: "🔮",                // Icon
  description: "...",         // Short description
  longDescription: "...",     // Full description
  color: {
    from: "#8b5cf6",         // Gradient start
    to: "#ec4899",           // Gradient end
    accent: "#a855f7"        // Accent color
  },
  enabled: true,             // Show/hide category
  visibility: "always",      // "always" | "hide-if-empty" | "never"
  order: 1,                  // Display order
  hasMedia: true             // Process images?
}
```

#### Visibility Rules

- **`always`**: Show even if no content
- **`hide-if-empty`**: Only show if content exists
- **`never`**: Never show (disabled)

### 5. Component Architecture

#### Scene Components

**MagicPortfolio.vue** - Main 3D scene

- Manages Three.js renderer, camera, controls
- Creates interactive 3D objects
- Handles mouse events (hover, click)
- Shows content modals

**Post.vue** - Single post detail

- Dynamic component loading based on schema
- Progressive image loading
- Back navigation

**PostSection.vue** - Category list

- Shows all items in a category
- Grid/list layout
- Filtering and search (future)

#### Service Layer

**API Service** (`api.ts`)

- Wrapper around GitCMS client
- Category-based queries
- Media processing integration

**Cache Manager** (`cacheManager.ts`)

- TTL-based caching
- Background refresh
- Cache statistics

**Database Service** (`database.ts`)

- GitCMS query builder
- Filters by published status
- Sorts by priority and date

**Media Service** (`mediaService.ts`)

- Thumbnail URL generation
- Progressive image loading
- Fast vs full resolution modes

---

## ⚙️ Configuration

### Environment Variables

Create `.env` in project root:

```bash
# GitCMS Repository (required)
VITE_GITCMS_REPOSITORY=YOUR_USERNAME/your-content-repo

# Branch (default: main)
VITE_GITCMS_BRANCH=main

# GitHub Token (optional - for private repos or higher rate limits)
# GITCMS_TOKEN=ghp_yourTokenHere

# Dev Server Port (optional)
VITE_PORT=5173
```

### Category Configuration

Edit `src/config/categories.ts` to:

- Enable/disable categories
- Change display order
- Modify colors and descriptions
- Control visibility rules

```typescript
export const categories: Record<string, CategoryConfig> = {
  "my-custom-category": {
    id: "my-custom-category",
    title: "Custom Category",
    emoji: "🎨",
    description: "My custom content",
    // ... rest of config
  },
};
```

### Theme Configuration

Modify `src/themes/wizard-lab/config/`:

**objects.ts** - 3D object positions, animations  
**lighting.ts** - Light types, colors, intensities  
**particles.ts** - Particle systems  
**scene.ts** - Camera, background, fog

Or create a new theme (see [Customization](#-customization)).

---

## 💻 Development

### Available Scripts

```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages (requires gh-pages package)
npm run deploy

# Lint code (if configured)
npm run lint
```

### Development Workflow

1. **Start dev server**: `npm run dev`
2. **Edit code**: Changes hot-reload automatically
3. **Check browser console**: For errors and debug info
4. **Test production build**: `npm run build && npm run preview`

### Debug Tools

When in development mode (`npm run dev`), these functions are available in browser console:

```javascript
// View cache statistics
cacheStats();

// Clear all cached data
clearCache();
```

### Adding a New Category

1. **Define category** in `src/config/categories.ts`
2. **Create GitCMS schema** in content repository
3. **Add 3D object** in theme config
4. **Create list component** in `src/components/sections/`
5. **Create detail component** in `src/components/posts/`
6. **Map component** in `PostSection.vue` and `Post.vue`

**Example**: See `docs-legacy/development/categories-refactory/` for detailed guides.

---

## 🚀 Deployment

### GitHub Pages (Recommended)

#### Automatic Deployment

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys on push to `main` branch.

**Setup**:

1. Go to repository **Settings** → **Pages**
2. Set **Source** to: `GitHub Actions`
3. Push to `main` → automatic deployment

**Configuration**:

Edit `.github/workflows/deploy.yml` to change environment variables:

```yaml
env:
  VITE_GITCMS_REPOSITORY: YOUR_USERNAME/your-content-repo
  VITE_GITCMS_BRANCH: main
```

#### Manual Deployment

```bash
# Build project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Vercel

1. **Import project** in Vercel dashboard
2. **Set environment variables**:
   ```
   VITE_GITCMS_REPOSITORY=YOUR_USERNAME/your-content-repo
   VITE_GITCMS_BRANCH=main
   ```
3. **Deploy** - automatic on every push

### Other Static Hosts

**Netlify, Cloudflare Pages, AWS S3, etc.**

```bash
# Build
npm run build

# Upload `dist/` folder to your host
```

---

## 🎨 Customization

### Changing Colors

**Tailwind Colors** (`tailwind.config.js`):

```javascript
colors: {
  magic: {
    400: "#818cf8",  // Change this
    500: "#6366f1",  // And this
  }
}
```

**Category Colors** (`src/config/categories.ts`):

```typescript
color: {
  from: "#8b5cf6",    // Gradient start
  to: "#ec4899",      // Gradient end
  accent: "#a855f7"   // Accent color
}
```

### Creating a Custom Theme

1. **Create theme folder**:

   ```
   src/themes/my-theme/
   ├── index.ts
   └── config/
       ├── objects.ts
       ├── lighting.ts
       ├── particles.ts
       └── scene.ts
   ```

2. **Define configurations** (copy from wizard-lab and modify)

3. **Register theme** in `src/themes/index.ts`:
   ```typescript
   import myTheme from "./my-theme";
   export default myTheme;
   ```

See **[docs/CREATING-THEMES.md](./docs/CREATING-THEMES.md)** for detailed guide.

### Adding 3D Models

1. **Download GLB model** from [Sketchfab](https://sketchfab.com/)
2. **Optimize** with [gltf.report](https://gltf.report/) (< 2MB recommended)
3. **Place** in `public/assets/models/your-model.glb`
4. **Update config**:
   ```typescript
   {
     modelPath: "assets/models/your-model.glb",
     scale: 1.0  // Adjust as needed
   }
   ```

### Modifying Animations

Edit object configs in `src/themes/wizard-lab/config/objects.ts`:

```typescript
animation: {
  floating: {
    enabled: true,
    amplitude: 0.3,    // Higher = more dramatic
    speed: 1.5         // Higher = faster
  },
  rotation: {
    enabled: true,
    speed: 0.01        // Rotation speed
  }
}
```

---

## 📚 API Reference

### API Service

```typescript
import { apiService } from "@/services/api";

// Get all posts in a category
const posts = await apiService.getPostsByCategory("project");

// Get single post
const post = await apiService.getPostById("project", "post-id");

// Get post with full-resolution media
const fullPost = await apiService.getPostByIdFull("project", "post-id");

// Get all categories with counts
const categories = await apiService.getAllCategories();

// Health check (no-op, for compatibility)
await apiService.healthCheck();
```

### Cached API Service

```typescript
import apiWithCache from "@/services/apiWithCache";

// Initialize cache (call once in main.ts)
await apiWithCache.initialize();

// Get cached posts
const posts = await apiWithCache.getByCategory("project");

// Force refresh
await apiWithCache.refreshCategory("project");

// Get cache stats
const stats = apiWithCache.getCacheStats();

// Clear cache
apiWithCache.clearCache();
```

### Database Service

```typescript
import { databaseService } from "@/services/database";

// Get all items by schema
const items = await databaseService.getBySchemaId("project");

// Get single item
const item = await databaseService.getByIdAndSchemaId("project", "id");

// Get count
const count = await databaseService.getCountBySchemaId("project");
```

### Media Service

```typescript
import { mediaService } from "@/services/mediaService";

// Process content with thumbnails (fast)
const processed = mediaService.processContentFast(post);

// Process with full resolution (slower)
const full = await mediaService.processContentFull(post);
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to fetch content from GitCMS"

**Causes**:

- Wrong repository name in `.env`
- Repository is private (need token)
- Branch doesn't exist
- No content in repository

**Solutions**:

```bash
# Verify .env
cat .env

# Test repository accessibility
curl https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO

# Check branch exists
git ls-remote https://github.com/YOUR_USERNAME/YOUR_REPO
```

#### 2. "Rate limit exceeded"

**Cause**: GitHub limits unauthenticated API to 60 requests/hour

**Solution**: Add GitHub token to `.env`:

```bash
GITCMS_TOKEN=ghp_yourTokenHere
```

Generate token at: [github.com/settings/tokens](https://github.com/settings/tokens)

#### 3. 3D models not loading

**Causes**:

- Missing model files in `public/assets/models/`
- Wrong file path
- Model too large (>10MB may cause issues)
- Unsupported format (needs .glb)

**Solutions**:

- Verify file exists: `ls public/assets/models/`
- Check browser console for 404 errors
- Optimize model: Use [gltf.report](https://gltf.report/)
- Convert to GLB: Use Blender or online converters

#### 4. White screen on mobile

**Cause**: WebGL not supported or scene too complex

**Solution**:

- Check browser console for errors
- App redirects to `/about` if 3D fails
- Reduce particle count in theme config
- Simplify models (lower poly count)

#### 5. Cache not updating

**Cause**: Cache TTL hasn't expired

**Solutions**:

```javascript
// In browser console:
clearCache();

// Or wait 5 minutes for auto-refresh
```

### Performance Issues

**Symptoms**: Low FPS, stuttering, high memory

**Solutions**:

1. **Reduce particles**:

   ```typescript
   // src/themes/wizard-lab/config/particles.ts
   particleCount: 500; // Lower from 1000
   ```

2. **Simplify models**:

   - Use lower poly count models
   - Remove unnecessary animations
   - Compress textures

3. **Disable shadows**:

   ```typescript
   // src/themes/wizard-lab/config/lighting.ts
   globalShadowSettings: {
     enabled: false;
   }
   ```

4. **Lower quality settings**:
   ```typescript
   // vite.config.ts
   renderer: {
     antialias: false; // Disable for performance
   }
   ```

---

## 🤝 Contributing

We welcome contributions! See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for guidelines.

### Quick Contribution Guide

1. **Fork** the repository
2. **Create branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** and test
4. **Commit**: `git commit -m "feat: add amazing feature"`
5. **Push**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

### Contribution Ideas

- 🐛 Bug fixes
- ✨ New features
- 🎨 New themes
- 📝 Documentation improvements
- 🌍 Internationalization
- ♿ Accessibility enhancements
- ⚡ Performance optimizations

---

## 🙏 Credits

### Built With

- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Three.js](https://threejs.org/) - 3D graphics library
- [Vite](https://vitejs.dev/) - Next-generation build tool
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [GitCMS](https://github.com/BestPlayerMMIII/gitcms) - Git-based CMS

### Author

**Manuel Maiuolo**

- Website: [bestplayer.dev](https://bestplayer.dev)
- GitHub: [@BestPlayerMMIII](https://github.com/BestPlayerMMIII)

### Contributors

See [contributors list](../../graphs/contributors) for all contributors.

### Inspiration

This project was inspired by the desire to create portfolio experiences that go beyond static pages, combining modern web technologies with creative 3D interactions.

---

## 📄 License

[**MIT License**](./LICENSE)

---

## 🌟 Star History

If you find this project useful, please consider giving it a star on GitHub!

---

## 📞 Support

- 📖 **Documentation**: Check [docs/](./docs/) folder
- 💬 **Discussions**: [GitHub Discussions](../../discussions)
- 🐛 **Issues**: [GitHub Issues](../../issues)
- 📧 **Contact**: Open an issue for questions

---

**Happy coding, and may your portfolio be magical! ✨🔮**
