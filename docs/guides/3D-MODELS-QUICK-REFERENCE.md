# 3D Models Quick Reference

Quick reference for working with 3D models in the Magic Portfolio project.

## TL;DR

**Old Way** ❌:

```typescript
{
  type: "crystal",
  modelPath: "/assets/models/crystal.glb", // Local file
}
```

**New Way** ✅:

```typescript
{
  type: "crystal",
  modelId: "crystal", // GitCMS ID
}
```

---

## Common Tasks

### Add a New 3D Object

1. **Upload to GitCMS**:

   - Use GitCMS admin panel
   - Upload `.glb` file
   - Note the ID (e.g., "new-model")

2. **Add to Configuration**:
   ```typescript
   // src/themes/wizard-lab/config/objects.ts
   {
     type: "new-model",
     contentType: "project", // or "" for decorative
     modelId: "new-model",   // GitCMS ID
     position: [0, 0, 0],
     rotation: [0, 0, 0],
     scale: 1.0,
     animation: { /* ... */ }
   }
   ```

### Get Model URL Programmatically

```typescript
import { threeDObjectService } from "@/services/threeDObjectService";

// Single model
const url = await threeDObjectService.getModelUrl("crystal");
console.log(url); // "https://raw.githubusercontent.com/..."

// Multiple models
const urls = await threeDObjectService.getModelUrlsMap([
  "crystal",
  "book",
  "room",
]);
console.log(urls.get("crystal")); // URL for crystal
```

### Check if Model Exists

```typescript
const model = await threeDObjectService.get3DObjectById("crystal");
if (!model) {
  console.error("Model not found!");
} else {
  console.log("Model found:", model.data.model.filename);
}
```

### Debug Model Loading

```typescript
// Check cache status
const stats = threeDObjectService.getCacheStats();
console.log("Cached objects:", stats.individualObjects);

// Clear cache and refetch
threeDObjectService.clearCache();
const model = await threeDObjectService.get3DObjectById("crystal");
```

---

## File Locations

| What             | Where                                         |
| ---------------- | --------------------------------------------- |
| Type definitions | `src/types/index.ts`, `src/types/3d/index.ts` |
| Service          | `src/services/threeDObjectService.ts`         |
| Object config    | `src/themes/wizard-lab/config/objects.ts`     |
| Documentation    | `docs/guides/3D-MODELS-GITCMS-INTEGRATION.md` |

---

## GitCMS Content Format

```json
{
  "id": "model-id",
  "schemaId": "3d-object",
  "data": {
    "model": {
      "url": "https://...",
      "filename": "model.glb",
      "mimeType": "model/gltf-binary"
    }
  },
  "metadata": {
    "status": "published"
  }
}
```

---

## Model IDs (Wizard Lab Theme)

| ID             | Object Type      | Interactive |
| -------------- | ---------------- | ----------- |
| `crystal`      | Project display  | ✅          |
| `cauldron`     | Work in progress | ✅          |
| `book`         | Blog posts       | ✅          |
| `magic-circle` | Collaborations   | ✅          |
| `library`      | Learning paths   | ✅          |
| `owl`          | Fun facts        | ✅          |
| `room`         | Environment      | ❌          |
| `lectern`      | Furniture        | ❌          |

---

## Troubleshooting

### Model not loading?

1. Check GitCMS has the model:

   ```typescript
   const model = await threeDObjectService.get3DObjectById("your-id");
   console.log(model);
   ```

2. Verify URL is accessible:

   - Copy URL from `model.data.model.url`
   - Open in browser
   - Should download the .glb file

3. Check browser console for errors

### Wrong model appearing?

- Clear cache: `threeDObjectService.clearCache()`
- Verify model ID matches GitCMS ID
- Check for typos in configuration

### Performance issues?

- Use `preloadAll()` to cache all models at startup
- Check cache stats: `getCacheStats()`
- Reduce model file sizes in GitCMS

---

## Best Practices

1. ✅ **Use `modelId`** for all new objects
2. ✅ **Use kebab-case** for IDs (`magic-circle`, not `MagicCircle`)
3. ✅ **Preload models** for better UX
4. ✅ **Handle errors** gracefully
5. ❌ **Don't** commit large .glb files to main repo
6. ❌ **Don't** hardcode URLs (use `modelId`)

---

## Migration Path

### Option 1: All at Once

```typescript
// Replace all modelPath with modelId
// Remove public/assets/models/
```

### Option 2: Gradual

```typescript
// Support both:
{
  modelId: "new-model",     // Preferred
  modelPath: "/old.glb",    // Fallback
}
```

---

## Quick Links

- [Full Documentation](./3D-MODELS-GITCMS-INTEGRATION.md)
- [Migration Summary](../development/3D-GITCMS-MIGRATION-SUMMARY.md)
- [GitCMS Docs](https://github.com/git-cms/docs)
