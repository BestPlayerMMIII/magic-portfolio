# 🚀 Quick Reference - Public Transport Mode

## Essential Commands

```bash
# Install GitCMS client (choose one method - see GITCMS-SETUP.md)
npm install /path/to/gitcms/packages/client

# Install dependencies
npm install

# Development
npm run dev          # Start dev server (port 5173)

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

## Essential Files

| File                       | Purpose                                |
| -------------------------- | -------------------------------------- |
| `src/services/gitcms.ts`   | GitCMS client initialization           |
| `src/services/database.ts` | Database queries                       |
| `src/services/api.ts`      | Main API service (backward compatible) |
| `src/config/categories.ts` | Category configuration                 |
| `.env`                     | Environment configuration              |

## Environment Setup

```bash
# .env file
VITE_GITCMS_REPOSITORY=your-username/your-repo
VITE_GITCMS_BRANCH=main
VITE_PORT=5173
```

## Import Patterns

```typescript
// GitCMS Client
import { gitcms } from "@/services/gitcms";

// Database Service
import { databaseService } from "@/services/database";

// API Service (backward compatible)
import { apiService } from "@/services/api";

// With Cache
import apiWithCache from "@/services/apiWithCache";

// Categories
import { getCategoryById, getEnabledCategories } from "@/config/categories";
```

## Common Tasks

### Fetch Posts

```typescript
// Direct database access
const posts = await databaseService.getBySchemaId("blog-post");

// Via API service (with media processing)
const posts = await apiService.getPostsByCategory("blog-post");

// With caching
const posts = await apiWithCache.getByCategory("blog-post");
```

### Fetch Single Post

```typescript
const post = await apiService.getPostById("blog-post", "my-post-id");

// With full resolution media
const post = await apiService.getPostByIdFull("blog-post", "my-post-id");
```

### Media Processing

```typescript
import { mediaService } from "@/services/mediaService";

// Fast (thumbnails)
const html = mediaService.renderFast(content);

// Full resolution
const html = await mediaService.renderFull(content);
```

## Project Structure

```
magic-portfolio/
├── src/
│   ├── services/
│   │   ├── gitcms.ts          # ← GitCMS client
│   │   ├── database.ts        # ← Database service
│   │   ├── api.ts             # ← API service (refactored)
│   │   ├── mediaService.ts    # ← Media processing
│   │   ├── apiWithCache.ts    # Cache layer
│   │   └── cacheManager.ts
│   ├── config/
│   │   └── categories.ts      # ← Category config
│   ├── components/
│   ├── scenes/
│   └── ...
├── .env                        # ← Your config
├── .env.example
├── package.json               # ← Updated scripts
├── vite.config.ts             # ← No proxy
└── vercel.json                # ← Static only
```

## Troubleshooting Quick Fixes

### Cannot find '@git-cms/client'

```bash
# Install the package first (see GITCMS-SETUP.md)
npm install /path/to/gitcms/packages/client
```

### Rate limit exceeded

```bash
# Wait for reset (60 req/hour for public mode)
# Or implement better caching
# Or use authenticated mode for builds
```

### Environment variables not working

```bash
# Restart dev server after changing .env
# Vite only loads env vars on startup
```

### CORS errors

```bash
# Ensure repository is public
# GitHub API handles CORS automatically
```

## Documentation Index

| Document                 | Purpose                |
| ------------------------ | ---------------------- |
| `GITCMS-SETUP.md`        | Install GitCMS client  |
| `QUICKSTART.md`          | Quick start guide      |
| `MIGRATION-COMPLETE.md`  | Full migration details |
| `REFACTORING-SUMMARY.md` | Technical summary      |
| `THIS FILE`              | Quick reference        |

## Debug Helpers

```javascript
// In browser console (dev mode only)
cacheStats(); // View cache statistics
clearCache(); // Clear all cached data

// Check GitCMS mode
console.log(gitcms.getTransportMode()); // Should be "public"
console.log(gitcms.isPublicMode()); // Should be true

// Check rate limits
const limits = await gitcms.getRateLimit();
console.log(limits);
```

## Key Differences from Before

| Aspect     | Before                 | After             |
| ---------- | ---------------------- | ----------------- |
| Server     | Express (Node.js)      | None              |
| API Calls  | HTTP to localhost:3001 | Direct GitCMS     |
| Deployment | Server + Client        | Static only       |
| Cost       | Server hosting         | Free (CDN)        |
| Startup    | 2 processes            | 1 process         |
| Token      | Required (backend)     | Optional (public) |

## Next Steps

1. ✅ Read this file
2. 📦 Install GitCMS client → `GITCMS-SETUP.md`
3. ⚙️ Configure environment → `.env`
4. 🏃 Run dev server → `npm run dev`
5. 🎨 Start building!

---

**Need Help?**

- Installation: `GITCMS-SETUP.md`
- Migration details: `MIGRATION-COMPLETE.md`
- Technical summary: `REFACTORING-SUMMARY.md`
