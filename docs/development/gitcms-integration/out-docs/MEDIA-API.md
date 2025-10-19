# GitCMS Media API

The GitCMS Media API provides a clean and efficient way to work with embedded
media in your content. It supports **fast thumbnail loading** with **progressive
enhancement** for full-resolution media.

## Features

- 🚀 **Fast Thumbnails**: Instant display using embedded base64 thumbnails
- 🔄 **Async Full Resolution**: Load high-quality media progressively
- 🎨 **Multiple Media Types**: Images, videos, audio, 3D models (.glb),
  documents
- 💾 **Smart Caching**: Automatic caching of fetched media
- 🎯 **Type-Safe**: Full TypeScript support
- 🔌 **Flexible**: Works with rich-text content and media fields

## Quick Start

```typescript
import { GitCMS } from "@git-cms/client";

const cms = new GitCMS({
  repository: "owner/repo",
  token: "your-github-token",
  branch: "main",
});

// Get a blog post with embedded media
const post = await cms.from("posts").doc("my-post").get();

// Extract media references (fast, synchronous)
const mediaRefs = cms.media.extractFromHTML(post.content);
console.log(`Found ${mediaRefs.length} media items`);

// Get thumbnails immediately (fast, synchronous)
mediaRefs.forEach((ref) => {
  const thumbnail = cms.media.getThumbnail(ref);
  console.log(
    `Thumbnail for ${ref.filename}: ${thumbnail.substring(0, 50)}...`
  );
});

// Fetch full resolution asynchronously
const fullMedia = await cms.media.fetchFull(mediaRefs[0]);
console.log(`Full resolution URL: ${fullMedia.url}`);
```

## Core Concepts

### Media References

A `MediaReference` is a lightweight object that describes a media item without
loading it:

```typescript
interface MediaReference {
  id: string; // Unique identifier
  path: string; // Path in repository (e.g., "media/images/hero.jpg")
  filename: string; // Original filename
  thumbnail?: string; // Embedded base64 thumbnail (if available)
  alt?: string; // Alt text
  title?: string; // Title attribute
  mimeType?: string; // MIME type (e.g., "image/jpeg")
  mediaType?: "image" | "video" | "audio" | "document" | "3d" | "other";
}
```

### Full Media Data

When you fetch full resolution media, you get a `FullMediaData` object:

```typescript
interface FullMediaData {
  reference: MediaReference; // Original reference
  url: string; // Full resolution data URL or blob URL
  content?: ArrayBuffer; // Raw content buffer
  size?: number; // Size in bytes
  downloadUrl?: string; // GitHub download URL
}
```

## API Reference

### MediaManager

The main class for working with media. Access it via `cms.media`.

#### Extract Media from HTML

Extract media references from HTML containing `<gitcms-media>` tags:

```typescript
const html = `
  <h1>My Post</h1>
  <gitcms-media 
    data-path="media/images/hero.jpg" 
    data-filename="hero.jpg" 
    data-thumbnail="data:image/jpeg;base64,..."
    alt="Hero image">
  </gitcms-media>
`;

const mediaRefs = cms.media.extractFromHTML(html);
// Returns: MediaReference[]
```

#### Extract Media from Fields

Extract media from schema fields (single or multiple):

```typescript
// Single media field
const profilePic = { path: "media/avatars/user.jpg" };
const ref = cms.media.extractFromField(profilePic);
// Returns: MediaReference | null

// Multiple media field
const gallery = [
  { path: "media/gallery/img1.jpg" },
  { path: "media/gallery/img2.jpg" },
];
const refs = cms.media.extractFromField(gallery);
// Returns: MediaReference[]
```

#### Get Thumbnails (Fast)

Get thumbnail URL for immediate display:

```typescript
const thumbnail = cms.media.getThumbnail(mediaRef);
// Returns: string (base64 data URL or placeholder)

// Use in your UI immediately
document.getElementById("img").src = thumbnail;
```

#### Fetch Full Resolution (Async)

Fetch full resolution media from GitHub:

```typescript
// Single media
const fullData = await cms.media.fetchFull(mediaRef);
console.log(fullData.url); // Full resolution URL
console.log(fullData.size); // File size in bytes
console.log(fullData.downloadUrl); // GitHub download URL

// With options
const fullData = await cms.media.fetchFull(mediaRef, {
  resolveLFS: true, // Handle LFS files
  timeout: 30000, // 30 second timeout
  onProgress: (loaded, total) => {
    console.log(`Progress: ${((loaded / total) * 100).toFixed(0)}%`);
  },
});
```

#### Fetch Multiple Media (Async)

Fetch multiple media items in parallel:

```typescript
const mediaRefs = cms.media.extractFromHTML(post.content);

// Fetch all with default concurrency (3)
const allMedia = await cms.media.fetchMultiple(mediaRefs);

// Custom concurrency
const allMedia = await cms.media.fetchMultiple(mediaRefs, {
  concurrency: 5, // Fetch 5 at a time
  resolveLFS: true,
});

// allMedia is an array of FullMediaData
allMedia.forEach((data) => {
  console.log(`${data.reference.filename}: ${data.url}`);
});
```

#### Render HTML (Fast)

Replace `<gitcms-media>` tags with standard HTML elements using thumbnails:

```typescript
const fastHtml = cms.media.renderFast(post.content);

// Input:
// <gitcms-media data-path="media/hero.jpg" data-thumbnail="data:..." alt="Hero"></gitcms-media>

// Output:
// <img src="data:image/jpeg;base64,..." alt="Hero" data-gitcms-thumbnail="true" loading="lazy" />
```

#### Render HTML (Full Resolution)

Replace `<gitcms-media>` tags with full resolution media:

```typescript
const fullHtml = await cms.media.renderFull(post.content, {
  onProgress: (current, total, ref) => {
    console.log(`Loading ${ref.filename} (${current}/${total})`);
  },
});

// All media is now full resolution
```

#### Cache Management

```typescript
// Clear cache
cms.media.clearCache();

// Get cache statistics
const stats = cms.media.getCacheStats();
console.log(`Cached items: ${stats.size}`);
console.log(`Cached paths: ${stats.keys.join(", ")}`);
```

### ContentMediaHelper

Higher-level helper for working with content items. Access via
`cms.contentMedia`.

#### Extract All Media from Content

Extract media from both rich-text and media fields:

```typescript
const post = await cms.from("posts").doc("my-post").get();

// Extracts from:
// - post.content (rich-text with <gitcms-media> tags)
// - post.data.* (any media fields)
const allMedia = cms.contentMedia.extractAll(post);
```

#### Get All Thumbnails

Get thumbnails for all media in a content item:

```typescript
const thumbnailMap = cms.contentMedia.getThumbnails(post);
// Returns: Map<string, string> (path -> thumbnail URL)

thumbnailMap.forEach((thumbnail, path) => {
  console.log(`${path}: ${thumbnail}`);
});
```

#### Preload All Media

Fetch all media for a content item:

```typescript
const mediaDataMap = await cms.contentMedia.preloadAll(post, {
  resolveLFS: true,
});
// Returns: Map<string, FullMediaData>

// Access full resolution media
mediaDataMap.forEach((data, path) => {
  console.log(`${path}: ${data.url}`);
});
```

#### Render Content (Fast)

Render entire content item with fast thumbnails:

```typescript
const fastPost = cms.contentMedia.renderFast(post);
// post.content now has <img> tags with thumbnails
```

#### Render Content (Full)

Render entire content item with full resolution media:

```typescript
const fullPost = await cms.contentMedia.renderFull(post);
// post.content now has <img> tags with full resolution images
```

## Usage Patterns

### Pattern 1: Fast Initial Render, Progressive Enhancement

Best for blog posts, articles, and content-heavy pages.

```typescript
import { GitCMS } from "@git-cms/client";

const cms = new GitCMS({
  /* config */
});

// 1. Fetch content
const post = await cms.from("posts").doc("my-post").get();

// 2. Render fast version immediately
const fastHtml = cms.media.renderFast(post.content);
document.getElementById("content").innerHTML = fastHtml;

// 3. Load full resolution in background
cms.media
  .renderFull(post.content, {
    onProgress: (current, total, ref) => {
      console.log(`Loading image ${current}/${total}`);
    },
  })
  .then((fullHtml) => {
    // Update with full resolution
    document.getElementById("content").innerHTML = fullHtml;
  });
```

### Pattern 2: React with Progressive Loading

```typescript
import React, { useState, useEffect } from "react";
import { GitCMS } from "@git-cms/client";

function BlogPost({ postId, cms }: { postId: string; cms: GitCMS }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    async function loadPost() {
      // Fetch post
      const post = await cms.from("posts").doc(postId).get();

      // Show thumbnails immediately
      const fastHtml = cms.media.renderFast(post.content);
      setContent(fastHtml);
      setLoading(false);

      // Load full resolution
      const fullHtml = await cms.media.renderFull(post.content, {
        onProgress: (current, total) => {
          setProgress({ current, total });
        },
      });
      setContent(fullHtml);
    }

    loadPost();
  }, [postId, cms]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {progress.total > 0 && progress.current < progress.total && (
        <div>
          Loading images: {progress.current}/{progress.total}
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
```

### Pattern 3: Next.js with SSR

```typescript
import { GitCMS } from "@git-cms/client";
import type { GetServerSideProps } from "next";

interface Props {
  content: string;
  mediaRefs: MediaReference[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const cms = new GitCMS({
    repository: process.env.GITCMS_REPOSITORY!,
    branch: process.env.GITCMS_BRANCH!,
    token: process.env.GITCMS_TOKEN!,
  });

  const post = await cms.from("posts").doc("my-post").get();

  // Render with thumbnails on server
  const content = cms.media.renderFast(post.content);

  // Send media references to client for progressive loading
  const mediaRefs = cms.media.extractFromHTML(post.content);

  return {
    props: { content, mediaRefs },
  };
};

export default function Post({ content, mediaRefs }: Props) {
  const [fullContent, setFullContent] = useState(content);

  useEffect(() => {
    // Load full resolution on client
    const cms = new GitCMS({
      /* client config */
    });

    (async () => {
      const fullHtml = await cms.media.renderFull(content);
      setFullContent(fullHtml);
    })();
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: fullContent }} />;
}
```

### Pattern 4: Gallery with Lazy Loading

```typescript
import { GitCMS } from "@git-cms/client";

const cms = new GitCMS({
  /* config */
});

async function loadGallery() {
  const gallery = await cms.from("galleries").doc("my-gallery").get();

  // gallery.data.images is an array of media references
  const mediaRefs = cms.media.extractFromField(gallery.data.images);

  // Show thumbnails first
  const container = document.getElementById("gallery");
  mediaRefs.forEach((ref) => {
    const img = document.createElement("img");
    img.src = cms.media.getThumbnail(ref);
    img.alt = ref.alt || ref.filename;
    img.dataset.path = ref.path;
    container.appendChild(img);
  });

  // Load full resolution on demand (when user clicks)
  container.addEventListener("click", async (e) => {
    const target = e.target as HTMLImageElement;
    if (target.tagName === "IMG" && target.dataset.path) {
      const ref = mediaRefs.find((r) => r.path === target.dataset.path);
      if (ref) {
        const fullData = await cms.media.fetchFull(ref);
        target.src = fullData.url;
      }
    }
  });
}
```

### Pattern 5: 3D Model Viewer

```typescript
import { GitCMS } from "@git-cms/client";

const cms = new GitCMS({
  /* config */
});

async function load3DModel(path: string) {
  // Create a reference for the 3D model
  const ref = cms.media.extractFromField({ path });

  if (ref && ref.mediaType === "3d") {
    // Fetch the full .glb file
    const fullData = await cms.media.fetchFull(ref, {
      resolveLFS: true, // Important for large 3D files
      onProgress: (loaded, total) => {
        console.log(
          `Loading 3D model: ${((loaded / total) * 100).toFixed(0)}%`
        );
      },
    });

    // Load into your 3D viewer (e.g., Three.js, Babylon.js)
    const blob = new Blob([fullData.content!], { type: "model/gltf-binary" });
    const blobUrl = URL.createObjectURL(blob);

    // Use with your 3D library
    loadIntoViewer(blobUrl);
  }
}
```

### Pattern 6: Video with Thumbnail Poster

```typescript
import { GitCMS } from "@git-cms/client";

const cms = new GitCMS({
  /* config */
});

async function createVideoPlayer(videoPath: string) {
  const ref = cms.media.extractFromField({ path: videoPath });

  if (ref && ref.mediaType === "video") {
    // Use thumbnail as poster
    const poster = cms.media.getThumbnail(ref);

    const video = document.createElement("video");
    video.poster = poster;
    video.controls = true;

    // Load full video on play
    video.addEventListener(
      "play",
      async () => {
        if (!video.src) {
          const fullData = await cms.media.fetchFull(ref);
          video.src = fullData.url;
        }
      },
      { once: true }
    );

    document.body.appendChild(video);
  }
}
```

## Media Types Support

The API automatically detects and handles different media types:

| Type         | Extensions                          | HTML Element | Notes                             |
| ------------ | ----------------------------------- | ------------ | --------------------------------- |
| **Image**    | jpg, jpeg, png, gif, webp, svg, bmp | `<img>`      | Supports thumbnails, lazy loading |
| **Video**    | mp4, webm, ogv, mov, avi            | `<video>`    | With controls, preload metadata   |
| **Audio**    | mp3, wav, ogg, oga, m4a             | `<audio>`    | With controls, preload metadata   |
| **3D Model** | glb, gltf, obj, fbx                 | `<a>`        | Download link, use with viewer    |
| **Document** | pdf, doc, docx, txt                 | `<a>`        | Download link                     |
| **Other**    | \*                                  | `<a>`        | Generic download link             |

## Performance Tips

1. **Use thumbnails first**: Always render with `renderFast()` before
   `renderFull()`
2. **Limit concurrency**: Don't fetch all media at once on slow connections
3. **Cache aware**: The API caches fetched media automatically
4. **Lazy load**: Consider using Intersection Observer for below-the-fold media
5. **LFS for large files**: Enable `resolveLFS: true` for videos and 3D models

```typescript
// Good: Progressive loading
const fast = cms.media.renderFast(content);
showContent(fast);
const full = await cms.media.renderFull(content);
updateContent(full);

// Bad: Blocking on full resolution
const full = await cms.media.renderFull(content); // User waits!
showContent(full);
```

## Error Handling

```typescript
try {
  const fullData = await cms.media.fetchFull(mediaRef, {
    timeout: 10000, // 10 second timeout
  });
} catch (error) {
  if (error.message.includes("timeout")) {
    // Handle timeout
    console.error("Media fetch timed out");
  } else if (error.message.includes("404")) {
    // Handle not found
    console.error("Media not found");
  } else {
    // Generic error
    console.error("Failed to fetch media:", error);
  }
}
```

## TypeScript Types

All types are exported from the package:

```typescript
import type {
  MediaReference,
  FullMediaData,
  MediaFetchOptions,
  MediaManager,
  ContentMediaHelper,
} from "@git-cms/client";
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires `fetch` API
- Requires `Promise` support
- Optional: `AbortSignal.timeout` for timeout support (or use polyfill)

## Summary

The GitCMS Media API provides:

- **Fast access**: `cms.media.getThumbnail(ref)` - instant thumbnails
- **Full resolution**: `cms.media.fetchFull(ref)` - high-quality async fetch
- **Easy rendering**: `cms.media.renderFast()` and `cms.media.renderFull()`
- **Content helpers**: `cms.contentMedia.extractAll()`, `preloadAll()`, etc.
- **Type safety**: Full TypeScript support
- **Flexibility**: Works with any media type (images, videos, 3D models, etc.)

This gives you complete control over the loading experience while maintaining a
clean, intuitive API.
