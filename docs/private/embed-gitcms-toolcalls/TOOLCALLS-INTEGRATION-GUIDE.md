# GitCMS Toolcalls - Quick Integration Guide

This guide helps you integrate the new Toolcalls feature into your existing
GitCMS project.

---

## 🚀 For Content Creators (Admin Panel Users)

### What's New?

A new **⚡ (Lightning/Zap)** button in the rich text editor toolbar!

### How to Use

1. **Click the ⚡ button** in the editor toolbar (next to the image button)
2. **Enter a Tool Call ID** (e.g., `BUTTON`, `VIDEO_EMBED`, `SUBSCRIBE`)
3. **Add parameters** (optional):
   - Click "Add Parameter" to add more fields
   - Enter key-value pairs (e.g., `text` = `Click me`)
   - Click the minus button to remove parameters
4. **Preview** your toolcall at the bottom
5. **Click "Insert Tool Call"**

### Visual Appearance

Toolcalls appear as **purple/violet cards** in the editor showing:

- The toolcall ID at the top
- All parameters below
- A "Tool Call" badge

You can:

- ✅ Click to select
- ✅ Delete with backspace/delete key
- ✅ Copy and paste
- ✅ Undo/redo

---

## 💻 For Developers (Client SDK Users)

### Installation

No installation needed! The feature is already included in `@git-cms/client`.

### Quick Start

```typescript
import { resolveToolcalls } from '@git-cms/client';

// 1. Define your renderers
const renderers = {
  BUTTON: (id, params) => {
    return `<a href="${params.href}" class="btn">${params.text}</a>`;
  },

  VIDEO: (id, params) => {
    return `<iframe src="https://youtube.com/embed/${params.videoId}"></iframe>`;
  },
};

// 2. Resolve toolcalls in your content
const processedContent = resolveToolcalls(article.content, renderers);

// 3. Use the processed content
document.getElementById('content').innerHTML = processedContent;
```

### TypeScript Support

```typescript
import type { ToolcallRenderers } from '@git-cms/client';

const renderers: ToolcallRenderers = {
  // Your renderers with full type safety
};
```

---

## 🔄 Migration Scenarios

### Scenario 1: New Project

No migration needed! Just start using toolcalls:

1. Create content with toolcalls in admin panel
2. Define renderers in your app
3. Call `resolveToolcalls()`

### Scenario 2: Existing Content (No Toolcalls Yet)

Your existing content will work unchanged:

```typescript
// This works fine even if content has no toolcalls
const processedContent = resolveToolcalls(existingContent, renderers);
```

### Scenario 3: Adding Toolcalls to Existing Content

1. **Edit** your existing articles in the admin panel
2. **Insert** toolcalls where you want interactive elements
3. **Save** the article
4. **Update** your app to include renderers
5. **Deploy** your changes

---

## 🎯 Common Integration Patterns

### Pattern 1: React Component

```tsx
import { resolveToolcalls } from '@git-cms/client';
import { useMemo } from 'react';

function Article({ content }) {
  const processedContent = useMemo(() => {
    const renderers = {
      BUTTON: (id, params) =>
        `<button onclick="window.handleAction('${params.action}')">${params.text}</button>`,
    };

    return resolveToolcalls(content, renderers);
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
}
```

### Pattern 2: Vue Component

```vue
<script setup>
import { computed } from 'vue';
import { resolveToolcalls } from '@git-cms/client';

const props = defineProps(['content']);

const renderers = {
  BUTTON: (id, params) => `<button class="btn">${params.text}</button>`,
};

const processedContent = computed(() =>
  resolveToolcalls(props.content, renderers)
);
</script>

<template>
  <div v-html="processedContent"></div>
</template>
```

### Pattern 3: Next.js Server Component

```tsx
import { resolveToolcalls } from '@git-cms/client';

async function ArticlePage({ params }) {
  const article = await fetchArticle(params.slug);

  const renderers = {
    BUTTON: (id, params) =>
      `<a href="${params.href}" class="btn">${params.text}</a>`,
  };

  const processedContent = resolveToolcalls(article.content, renderers);

  return <article dangerouslySetInnerHTML={{ __html: processedContent }} />;
}
```

### Pattern 4: Async Data Fetching

```typescript
import { resolveToolcallsAsync } from '@git-cms/client';

const renderers = {
  USER_CARD: async (id, params) => {
    const user = await fetch(`/api/users/${params.userId}`).then(r => r.json());
    return `<div class="card">${user.name}</div>`;
  },
};

const processedContent = await resolveToolcallsAsync(content, renderers);
```

---

## 📦 Recommended Renderer Library

Create a reusable renderer library for your project:

```typescript
// lib/toolcall-renderers.ts

import type { ToolcallRenderers } from '@git-cms/client';

export const commonRenderers: ToolcallRenderers = {
  BUTTON: (id, params) => {
    const classes = {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-600 text-white',
      outline: 'border-2 border-blue-600 text-blue-600',
    };

    return `
      <a href="${params.href}" 
         class="px-6 py-3 rounded-lg ${classes[params.style] || classes.primary}">
        ${params.text}
      </a>
    `;
  },

  VIDEO: (id, params) => {
    const embedUrl =
      params.platform === 'youtube'
        ? `https://youtube.com/embed/${params.videoId}`
        : `https://player.vimeo.com/video/${params.videoId}`;

    return `
      <iframe src="${embedUrl}" 
              width="640" height="360" 
              frameborder="0" allowfullscreen>
      </iframe>
    `;
  },

  ALERT: (id, params) => {
    const types = {
      info: 'bg-blue-100 text-blue-900',
      warning: 'bg-yellow-100 text-yellow-900',
      success: 'bg-green-100 text-green-900',
      error: 'bg-red-100 text-red-900',
    };

    return `
      <div class="p-4 rounded ${types[params.type] || types.info}">
        <strong>${params.title}</strong>
        <p>${params.message}</p>
      </div>
    `;
  },
};

// Usage in your app:
import { commonRenderers } from './lib/toolcall-renderers';

const processedContent = resolveToolcalls(content, {
  ...commonRenderers,
  // Add project-specific renderers
  CUSTOM_WIDGET: (id, params) => '...',
});
```

---

## 🧪 Testing Your Integration

### 1. Test with Simple Content

```typescript
const testContent = `
  <p>Test paragraph</p>
  <gitcms-toolcall id="BUTTON" _text="Click me" _href="/test"></gitcms-toolcall>
  <p>More content</p>
`;

const renderers = {
  BUTTON: (id, params) => `<button>${params.text}</button>`,
};

const result = resolveToolcalls(testContent, renderers);
console.log(result);
// Should show: <p>Test paragraph</p><button>Click me</button><p>More content</p>
```

### 2. Test Error Handling

```typescript
const result = resolveToolcalls(testContent, renderers, {
  fallback: (id, params) => {
    console.warn('Unknown toolcall:', id);
    return `<span class="error">Unknown: ${id}</span>`;
  },
});
```

### 3. Test Parameter Parsing

```typescript
const testContent = `
  <gitcms-toolcall 
    id="TEST" 
    _key1="value1" 
    _key2="value with spaces"
    _key3="value&quot;with&quot;quotes">
  </gitcms-toolcall>
`;

const renderers = {
  TEST: (id, params) => {
    console.log('Params:', params);
    // Should show: { key1: 'value1', key2: 'value with spaces', key3: 'value"with"quotes' }
    return '';
  },
};

resolveToolcalls(testContent, renderers);
```

---

## 🐛 Troubleshooting

### Problem: Toolcalls not appearing in editor

**Solution:**

- Make sure you're using the latest version of `packages/admin`
- Check that the TipTap editor has the `GitCMSToolcall` extension loaded
- Look for errors in the browser console

### Problem: Toolcalls not being resolved

**Solution:**

- Verify the toolcall ID matches exactly (case-sensitive)
- Check that the renderer function returns a string or HTMLElement
- Look for JavaScript errors in the console
- Test with a simple renderer first

### Problem: Parameters not passed correctly

**Solution:**

- Remember all parameters are strings
- Check for special characters that might need escaping
- Use `console.log(params)` in your renderer to debug
- Verify parameter names don't have typos

### Problem: TypeScript errors

**Solution:**

```typescript
import type { ToolcallRenderers } from '@git-cms/client';

// Explicit type annotation
const renderers: ToolcallRenderers = {
  BUTTON: (id, params) => `<button>${params.text}</button>`,
};
```

---

## 📚 Additional Resources

- 📖 [Full Documentation](./TOOLCALLS-GUIDE.md)
- 💡 [Code Examples](../examples/toolcalls-usage.ts)
- 🏗️ [Architecture Overview](./TOOLCALLS-ARCHITECTURE.md)
- 📝 [Implementation Summary](./TOOLCALLS-IMPLEMENTATION-SUMMARY.md)

---

## ✅ Checklist: Integration Complete

Before going live, verify:

- [ ] Admin panel shows ⚡ button in toolbar
- [ ] Can insert toolcalls in editor
- [ ] Toolcalls appear correctly in editor
- [ ] Defined renderers for all toolcall IDs you're using
- [ ] Tested `resolveToolcalls()` in your app
- [ ] Content displays correctly after resolution
- [ ] Tested with existing content (backward compatibility)
- [ ] Added error handling (fallback renderer)
- [ ] Sanitized user input in renderers (security)
- [ ] Tested on production-like environment

---

## 🎉 You're Ready!

The Toolcalls feature is now integrated into your GitCMS project. Start creating
dynamic, interactive content!

**Need help?** Check the [documentation](./TOOLCALLS-GUIDE.md) or
[open an issue](https://github.com/BestPlayerMMIII/GitCMS/issues).
