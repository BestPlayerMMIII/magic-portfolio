# 3D Models GitCMS Integration

This guide explains how 3D models are now managed through GitCMS instead of the local `public` folder.

## Overview

Previously, 3D models were stored in the `public/assets/models/` folder and referenced using local paths like `/assets/models/crystal.glb`. Now, models are managed through GitCMS using the `3d-object` schema, allowing for:

- Centralized model management
- Version control for 3D assets
- Dynamic model loading from GitHub
- No need to commit large binary files to the main repository

## Schema Structure

### GitCMS Schema: `3d-object`

Example content file: `content/3d-object/room.json`

```json
{
  "id": "room",
  "schemaId": "3d-object",
  "data": {
    "model": {
      "id": "media_37500529_room176227",
      "filename": "room-1762271038466.glb",
      "originalName": "room-1762271038466.glb",
      "path": "media/room-1762271038466.glb",
      "size": 10947796,
      "mimeType": "model/gltf-binary",
      "mediaType": "other",
      "url": "https://raw.githubusercontent.com/BestPlayerMMIII/gitcms-magic-portfolio/main/media/room-1762271038466.glb",
      "metadata": {},
      "uploadedAt": "2025-11-04T15:45:38.758Z",
      "uploadedBy": "unknown",
      "repository": {
        "owner": "BestPlayerMMIII",
        "repo": "gitcms-magic-portfolio"
      }
    }
  },
  "metadata": {
    "id": "room",
    "createdAt": "2025-11-04T15:45:46.499Z",
    "updatedAt": "2025-11-04T15:46:00.111Z",
    "status": "published",
    "publishedAt": "2025-11-04T15:46:00.111Z"
  }
}
```

## TypeScript Types

### Core Types

```typescript
// Media object returned from GitCMS
export interface MediaObject {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  mediaType: string;
  url: string;
  metadata: Record<string, any>;
  uploadedAt: string;
  uploadedBy: string;
  repository: {
    owner: string;
    repo: string;
  };
}

// 3D Object data structure
export interface ThreeDObject {
  model: MediaObject;
}

// Schema type updated to include 3d-object
export type SchemaType =
  | "project"
  | "blog-post"
  | "work-in-progress"
  | "collaboration"
  | "learning-path"
  | "fun-facts"
  | "3d-object";
```

### Object Configuration

```typescript
export interface ObjectConfig {
  type: string;
  contentType: NullableSchemaType;
  modelPath?: string; // DEPRECATED - use modelId instead
  modelId?: string; // NEW - GitCMS 3D object ID
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  isInteractive?: boolean;
  text?: TextConfig;
  animation: AnimationConfig;
}
```

## Usage

### 1. Service: `threeDObjectService`

The new `threeDObjectService` handles fetching 3D models from GitCMS:

```typescript
import { threeDObjectService } from "@/services/threeDObjectService";

// Get all 3D objects
const allObjects = await threeDObjectService.getAll3DObjects();

// Get a single object by ID
const crystal = await threeDObjectService.get3DObjectById("crystal");

// Get just the model URL
const modelUrl = await threeDObjectService.getModelUrl("room");

// Get multiple objects
const objects = await threeDObjectService.get3DObjectsByIds([
  "crystal",
  "book",
  "cauldron",
]);

// Get URL map for multiple objects
const urlsMap = await threeDObjectService.getModelUrlsMap(["crystal", "book"]);
// Returns: Map { "crystal" => "https://...", "book" => "https://..." }
```

### 2. Object Configuration

Update your object configurations to use `modelId` instead of `modelPath`:

**Before (deprecated):**

```typescript
{
  type: "crystal",
  contentType: "project",
  modelPath: "/assets/models/crystal.glb", // ❌ Old way
  position: [0, 3, -1],
  // ...
}
```

**After (recommended):**

```typescript
{
  type: "crystal",
  contentType: "project",
  modelId: "crystal", // ✅ New way - references GitCMS ID
  position: [0, 3, -1],
  // ...
}
```

### 3. Preloader Integration

The `PreloaderService` automatically handles both local paths and GitCMS models:

```typescript
// Automatically fetches GitCMS URLs for models with modelId
await preloaderService.preloadAssets(objectsConfig);

// Internally, this:
// 1. Collects all modelId values
// 2. Fetches URLs from GitCMS
// 3. Preloads both local and GitCMS models
```

### 4. Object Manager Integration

The `ObjectManager` seamlessly handles both types:

```typescript
// Automatically resolves modelId to URL from GitCMS
await objectManager.createObjectsFromConfig(objectsConfig);

// For each object:
// - If modelId exists: fetch URL from GitCMS
// - If only modelPath exists: use local path (backward compatible)
// - Load the model from resolved URL/path
```

## Migration Guide

### Step 1: Upload Models to GitCMS

1. Use your GitCMS admin panel to upload 3D models
2. The models will be stored in the GitCMS media repository
3. Note the IDs assigned to each model (e.g., "crystal", "room", "book")

### Step 2: Update Object Configurations

Replace `modelPath` with `modelId` in your theme configurations:

```typescript
// src/themes/wizard-lab/config/objects.ts

export const wizardLabObjects: ObjectConfig[] = [
  {
    type: "crystal",
    contentType: "project",
    modelId: "crystal", // Changed from modelPath
    position: [0, 3, -1],
    rotation: [0, 0, 0],
    scale: 0.002,
    animation: {
      /* ... */
    },
  },
  // ... other objects
];
```

### Step 3: Remove Local Models (Optional)

Once all models are using GitCMS, you can remove the `public/assets/models/` folder to reduce repository size.

## Caching

The `threeDObjectService` includes built-in caching:

- Individual objects are cached after first fetch
- All objects can be cached with `preloadAll()`
- Cache can be cleared with `clearCache()`

```typescript
// Preload all 3D objects into cache
await threeDObjectService.preloadAll();

// Get cache statistics
const stats = threeDObjectService.getCacheStats();
console.log(stats);
// { individualObjects: 8, hasAllObjectsCache: true }

// Clear cache if needed
threeDObjectService.clearCache();
```

## Benefits

1. **Centralized Management**: All 3D assets in one GitCMS repository
2. **Version Control**: Track changes to 3D models over time
3. **Reduced Repository Size**: Binary files not in main repo
4. **Dynamic Loading**: Models loaded from CDN (GitHub raw URLs)
5. **Easy Updates**: Update models without redeploying application
6. **Backward Compatible**: Still supports local `modelPath` for legacy objects

## Troubleshooting

### Model Not Loading

```typescript
// Check if model exists in GitCMS
const model = await threeDObjectService.get3DObjectById("mymodel");
if (!model) {
  console.error("Model not found in GitCMS");
}
```

### CORS Issues

GitHub raw URLs should work without CORS issues. If you encounter problems:

- Ensure the GitCMS repository is public
- Check the browser console for specific errors
- Verify the URL is accessible directly in browser

### Cache Issues

```typescript
// Clear cache and refetch
threeDObjectService.clearCache();
const freshModel = await threeDObjectService.get3DObjectById("crystal");
```

## Best Practices

1. **Use `modelId` for new objects**: Always prefer `modelId` over `modelPath`
2. **Consistent naming**: Use kebab-case for model IDs (e.g., "magic-circle", not "Magic Circle")
3. **Preload when possible**: Use `preloadAll()` for better UX
4. **Handle errors gracefully**: Always check if model exists before using
5. **Monitor cache**: Use `getCacheStats()` to verify caching behavior

## Example: Complete Workflow

```typescript
// 1. Define object configuration
const config: ObjectConfig = {
  type: "crystal",
  contentType: "project",
  modelId: "crystal", // GitCMS ID
  position: [0, 3, -1],
  rotation: [0, 0, 0],
  scale: 0.002,
  animation: {
    /* ... */
  },
};

// 2. Service automatically fetches from GitCMS
await preloaderService.preloadAssets([config]);

// 3. Object manager loads the model
await objectManager.createObjectsFromConfig([config]);

// Behind the scenes:
// - threeDObjectService.getModelUrl("crystal")
// - Returns: "https://raw.githubusercontent.com/..."
// - ModelLoader loads from that URL
```

## Related Files

- **Types**: `src/types/index.ts`, `src/types/3d/index.ts`
- **Service**: `src/services/threeDObjectService.ts`
- **Integration**: `src/services/core/preloaderService.ts`, `src/services/core/objectManager.ts`
- **Configuration**: `src/themes/wizard-lab/config/objects.ts`
- **Database**: `src/services/database.ts`
