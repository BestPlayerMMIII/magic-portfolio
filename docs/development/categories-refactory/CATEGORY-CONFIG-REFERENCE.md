# Category Configuration Quick Reference

## Quick Start

### Server Configuration

**File:** `server/src/config/categories.ts`

```typescript
export const categories: Record<string, CategoryConfig> = {
  "your-category-id": {
    // IDENTITY
    id: "your-category-id", // Must match GitCMS schema
    schemaId: "your-category-id", // Same as id
    apiPath: "your-api-path", // URL segment (e.g., "projects")

    // DISPLAY
    title: "Your Title", // Navigation text
    emoji: "🎯", // Navigation icon
    description: "Short desc", // Card description
    longDescription: "Long desc", // Section page description

    // STYLING
    color: {
      from: "#8b5cf6", // Gradient start
      to: "#ec4899", // Gradient end
      accent: "#a855f7", // Accent color
    },

    // BEHAVIOR
    enabled: true, // Show/hide category
    visibility: "hide-if-empty", // Visibility rule
    order: 1, // Display order (lower = first)

    // MEDIA
    hasMedia: false, // Process media fields?
    mediaFields: [], // Which fields to process
  },
};
```

### Frontend Configuration

**File:** `src/config/sectionDescriptions.ts`

Use the same structure as server config (synced automatically).

## Visibility Rules

| Rule              | Behavior                      | Use Case                                |
| ----------------- | ----------------------------- | --------------------------------------- |
| `"always"`        | Always visible, even if empty | Core sections (Projects, Blog)          |
| `"hide-if-empty"` | Hidden when no posts          | Optional sections (WIP, Collaborations) |
| `"never"`         | Never visible                 | Disabled features                       |

## Common Patterns

### Core Category (Always Show)

```typescript
{
  enabled: true,
  visibility: "always",
  order: 1,
}
```

### Optional Category (Hide When Empty)

```typescript
{
  enabled: true,
  visibility: "hide-if-empty",
  order: 5,
}
```

### Disabled Category

```typescript
{
  enabled: false,
  visibility: "never",
}
```

### Category with Media

```typescript
{
  hasMedia: true,
  mediaFields: ["header.image", "content"],
}
```

## API Endpoints

### Generic Endpoints (NEW)

```
GET /api/posts                    # All categories
GET /api/posts/:category          # All posts in category
GET /api/posts/:category/:id      # Single post (thumbnails)
GET /api/posts/:category/:id/full # Single post (full res)
```

### Legacy Endpoints (Deprecated)

```
GET /api/projects                 # Use /api/posts/project
GET /api/blog                     # Use /api/posts/blog-post
GET /api/wip                      # Use /api/posts/work-in-progress
GET /api/collaborations           # Use /api/posts/collaboration
GET /api/learning-path            # Use /api/posts/learning-path
GET /api/fun-facts                # Use /api/posts/fun-fact
```

## Code Examples

### Add New Category

1. **Update Server Config:**

```typescript
// server/src/config/categories.ts
"tutorials": {
  id: "tutorials",
  schemaId: "tutorials",
  apiPath: "tutorials",
  title: "Tutorials",
  emoji: "📚",
  description: "Step-by-step guides",
  longDescription: "Detailed tutorials...",
  color: {
    from: "#10b981",
    to: "#14b8a6",
    accent: "#34d399",
  },
  enabled: true,
  visibility: "hide-if-empty",
  order: 7,
  hasMedia: true,
  mediaFields: ["thumbnail", "content"],
}
```

2. **Update Frontend Config:**

```typescript
// src/config/sectionDescriptions.ts
// Copy the same configuration
```

3. **Done!** API endpoints work automatically.

### Fetch Posts (Frontend)

```typescript
// Using new generic API
import { apiService } from "@/services/api";

const posts = await apiService.getPostsByCategory("tutorials");
const post = await apiService.getPostById("tutorials", "my-tutorial-id");
```

### Fetch Posts (Server)

```typescript
// Using new generic database methods
import { databaseService } from "./services/database";

const posts = await databaseService.getBySchemaId("tutorials");
const post = await databaseService.getByIdAndSchemaId("tutorials", "id");
```

### Check Visibility

```typescript
import { shouldShowSection } from "@/config/sectionDescriptions";

const section = getSectionDescription("tutorials");
const posts = await apiWithCache.getByType("tutorials");
const visible = shouldShowSection(section, posts.length);
```

## Color Palette Reference

### Purple Theme

```typescript
color: {
  from: "#8b5cf6", // purple-500
  to: "#ec4899",   // pink-500
  accent: "#a855f7" // purple-500
}
```

### Blue Theme

```typescript
color: {
  from: "#06b6d4", // cyan-500
  to: "#3b82f6",   // blue-500
  accent: "#22d3ee" // cyan-400
}
```

### Green Theme

```typescript
color: {
  from: "#10b981", // emerald-500
  to: "#14b8a6",   // teal-500
  accent: "#34d399" // emerald-400
}
```

### Orange Theme

```typescript
color: {
  from: "#f59e0b", // amber-500
  to: "#ef4444",   // red-500
  accent: "#fbbf24" // amber-400
}
```

### Pink Theme

```typescript
color: {
  from: "#f43f5e", // rose-500
  to: "#ec4899",   // pink-500
  accent: "#fb7185" // rose-400
}
```

## Emoji Reference

Popular emojis for categories:

- 🔮 Projects/Code
- 📖 Blog/Reading
- ⚗️ Experiments/WIP
- 🤝 Collaboration
- 📚 Learning/Education
- 🦉 Fun/Trivia
- 🎯 Goals/Targets
- 💡 Ideas/Tips
- 🚀 Launches/Releases
- 🎨 Design/Creative
- 🔧 Tools/Utilities
- 📝 Notes/Documentation

## Troubleshooting

### Category Not Showing

1. Check `enabled: true`
2. Check visibility rule
3. Verify posts exist (if using "hide-if-empty")
4. Check order value

### API 404 Error

1. Verify schemaId matches GitCMS schema
2. Check category is enabled
3. Try both schemaId and apiPath

### Media Not Processing

1. Set `hasMedia: true`
2. Add fields to `mediaFields` array
3. Verify GitCMS media tags in content

## Best Practices

✅ **DO:**

- Use descriptive schemaIds
- Keep order values spaced (1, 2, 3... not 1, 1.1, 1.2)
- Use "hide-if-empty" for optional sections
- Document color choices
- Test both API formats (schemaId and apiPath)

❌ **DON'T:**

- Change schemaId after deployment (breaks links)
- Use special characters in apiPath
- Set all categories to "always" (clutters UI)
- Forget to sync frontend and backend configs

## Migration Checklist

When adding a new category:

- [ ] Add to server config (`server/src/config/categories.ts`)
- [ ] Add to frontend config (`src/config/sectionDescriptions.ts`)
- [ ] Create GitCMS schema in repository
- [ ] Add icon to `src/config/sectionIcons.ts`
- [ ] Test API endpoint: `GET /api/posts/your-category`
- [ ] Test visibility logic
- [ ] Verify navigation displays correctly
- [ ] Check mobile responsive layout
- [ ] Update documentation

---

**Quick Links:**

- [Full Refactoring Guide](./API-REFACTORING-GUIDE.md)
- [Server Config](../../server/src/config/categories.ts)
- [Frontend Config](../../src/config/sectionDescriptions.ts)
