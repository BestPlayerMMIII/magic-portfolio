# API Refactoring: Generic Posts System

## Overview

This document describes the major refactoring to simplify and modularize the Magic Portfolio API system. The new architecture uses generic endpoints and centralized configuration instead of hardcoded category-specific routes.

## Key Changes

### 1. Centralized Category Configuration

**Server:** `server/src/config/categories.ts`
**Frontend:** `src/config/sectionDescriptions.ts`

All category metadata (schemaId, apiPath, colors, icons, descriptions, visibility rules) is now managed in a single configuration file.

#### Category Configuration Interface

```typescript
interface CategoryConfig {
  id: string; // schemaId in GitCMS
  schemaId: string; // Same as id
  apiPath: string; // URL path (e.g., "projects", "blog")
  title: string;
  emoji: string;
  description: string;
  longDescription: string;
  color: {
    from: string;
    to: string;
    accent: string;
  };
  enabled: boolean; // Master on/off switch
  visibility: VisibilityRule; // "always" | "hide-if-empty" | "never"
  order: number; // Display order
  hasMedia: boolean; // Whether to process media
  mediaFields?: string[]; // Specific fields to process
}
```

#### Visibility Rules

- **`always`**: Show category even if empty
- **`hide-if-empty`**: Hide category when no posts exist
- **`never`**: Never show category (useful for disabled features)

### 2. New Generic API Endpoints

#### Server Routes (`/api/posts/*`)

**GET /api/posts**

- Returns all categories with metadata and counts
- Includes visibility information

**GET /api/posts/:category**

- Get all posts in a category
- Supports both schemaId and apiPath
- Examples: `/api/posts/project` or `/api/posts/projects`

**GET /api/posts/:category/:id**

- Get single post with thumbnails
- Fast loading with low-res media

**GET /api/posts/:category/:id/full**

- Get single post with full resolution media
- For detailed view

### 3. Backward Compatibility

All old endpoints still work:

- `/api/projects` → `/api/posts/project`
- `/api/blog` → `/api/posts/blog-post`
- `/api/wip` → `/api/posts/work-in-progress`
- `/api/collaborations` → `/api/posts/collaboration`
- `/api/learning-path` → `/api/posts/learning-path`
- `/api/fun-facts` → `/api/posts/fun-fact`

Legacy routes are kept for smooth transition.

## Migration Guide

### For Backend Developers

#### Adding a New Category

1. **Add to server config** (`server/src/config/categories.ts`):

```typescript
export const categories: Record<string, CategoryConfig> = {
  // ... existing categories

  "my-new-category": {
    id: "my-new-category",
    schemaId: "my-new-category",
    apiPath: "my-categories",
    title: "My Categories",
    emoji: "🎯",
    description: "Short description",
    longDescription: "Long description for section page",
    color: {
      from: "#8b5cf6",
      to: "#ec4899",
      accent: "#a855f7",
    },
    enabled: true,
    visibility: "hide-if-empty",
    order: 7,
    hasMedia: false,
  },
};
```

2. **Create GitCMS schema** (in your GitCMS repository)

3. **That's it!** The generic endpoints automatically work.

#### Using Generic Database Methods

**OLD (Deprecated):**

```typescript
const projects = await dbService.getProjects();
const project = await dbService.getProjectById(id);
```

**NEW (Preferred):**

```typescript
const projects = await dbService.getBySchemaId("project");
const project = await dbService.getByIdAndSchemaId("project", id);
```

### For Frontend Developers

#### Using New API Service

**OLD (Deprecated):**

```typescript
import { apiService } from "@/services/api";

const projects = await apiService.getProjects();
const project = await apiService.getProjectById(id);
```

**NEW (Preferred):**

```typescript
import { apiService } from "@/services/api";

const projects = await apiService.getPostsByCategory("project");
const project = await apiService.getPostById("project", id);
const fullPost = await apiService.getPostByIdFull("project", id);
```

#### Using Cache Service

**No changes needed!** The cache service automatically uses the new generic methods internally:

```typescript
import apiWithCache from "@/services/apiWithCache";

// Still works exactly the same
const projects = await apiWithCache.getProjects();
const blogPosts = await apiWithCache.getBlogPosts();

// NEW: Generic methods
const posts = await apiWithCache.getByType("project");
const post = await apiWithCache.getPostById("blog-post", "my-post-id");
```

#### Managing Visibility

```typescript
import {
  getAllSectionDescriptions,
  shouldShowSection,
} from "@/config/sectionDescriptions";

const sections = getAllSectionDescriptions(); // Only enabled, sorted by order

sections.forEach(async (section) => {
  const posts = await apiWithCache.getByType(section.schemaId);
  const visible = shouldShowSection(section, posts.length);

  if (visible) {
    // Render section
  }
});
```

## Configuration Examples

### Always Show a Category

```typescript
{
  visibility: "always",
  enabled: true,
}
```

Use for core categories like Projects and Blog.

### Hide Empty Categories

```typescript
{
  visibility: "hide-if-empty",
  enabled: true,
}
```

Use for optional sections like WIP, Collaborations, Learning Paths.

### Temporarily Disable a Category

```typescript
{
  visibility: "never",
  enabled: false,
}
```

Use when deprecating or temporarily hiding features.

### Process Media in Category

```typescript
{
  hasMedia: true,
  mediaFields: ["header.image", "content"],
}
```

Server will automatically process GitCMS media tags for these fields.

## Benefits

### 🎯 Centralization

- Single source of truth for all category metadata
- Change category settings in one place
- No hardcoded values scattered across codebase

### 🔧 Modularity

- Add new categories by updating config only
- No need to create new routes or services
- Automatic API endpoint generation

### 🚀 Simplification

- Generic methods replace 100+ lines of repetitive code
- Fewer files to maintain
- Clearer code structure

### 📊 Flexibility

- Easy visibility control (always/hide-if-empty/never)
- Per-category enable/disable
- Display order management
- Media processing configuration

### 🔄 Backward Compatibility

- Old endpoints still work
- Gradual migration path
- Zero breaking changes

## File Structure

```
server/
├── src/
│   ├── config/
│   │   └── categories.ts          # NEW: Category configuration
│   ├── routes/
│   │   ├── posts.ts                # NEW: Generic posts router
│   │   ├── projects.ts             # Legacy (still works)
│   │   ├── blog.ts                 # Legacy (still works)
│   │   └── ...
│   └── services/
│       └── database.ts             # UPDATED: Generic methods added

src/
├── config/
│   ├── sectionDescriptions.ts     # UPDATED: Extended with visibility
│   └── sectionIcons.ts            # Existing
└── services/
    ├── api.ts                      # UPDATED: Generic methods added
    └── apiWithCache.ts            # UPDATED: Uses new methods
```

## Testing Checklist

### Server Testing

- [ ] `GET /api/posts` returns all categories
- [ ] `GET /api/posts/project` returns projects
- [ ] `GET /api/posts/projects` returns projects (legacy path)
- [ ] `GET /api/posts/blog-post/:id` returns single post
- [ ] `GET /api/posts/blog-post/:id/full` returns full resolution
- [ ] Disabled categories return 403
- [ ] Invalid categories return 404
- [ ] Media processing works for blog posts
- [ ] Old endpoints still work (`/api/projects`, `/api/blog`, etc.)

### Frontend Testing

- [ ] `apiService.getPostsByCategory()` works for all categories
- [ ] `apiWithCache.getByType()` respects cache
- [ ] Visibility rules hide empty categories
- [ ] Navigation only shows enabled categories
- [ ] Icons and colors display correctly
- [ ] Section order matches configuration
- [ ] Old component code still works

## Next Steps

1. **Monitor Performance**: Track response times for generic endpoints
2. **Deprecate Legacy Routes**: After stable period, remove old category-specific routes
3. **Add More Categories**: Use config system to add new content types
4. **Enhanced Filtering**: Add query parameters for filtering/sorting
5. **Category Stats**: Extend `/api/posts` endpoint with more metadata

## Support

For questions or issues with the new system:

1. Check this documentation
2. Review `server/src/config/categories.ts`
3. Review `src/config/sectionDescriptions.ts`
4. Check example usage in components

---

**Version**: 1.0.0
**Last Updated**: 2025-10-20
**Author**: Magic Portfolio Team
