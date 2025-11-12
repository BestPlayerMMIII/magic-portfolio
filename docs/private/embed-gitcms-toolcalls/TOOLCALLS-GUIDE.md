# GitCMS Toolcalls Feature

The **Toolcalls** feature allows you to embed interactive, dynamic elements in
your rich text content using the Admin Panel, and easily render them with custom
logic in your client application.

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Admin Panel Usage](#admin-panel-usage)
- [Client SDK Usage](#client-sdk-usage)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

---

## Overview

Toolcalls let you:

1. **Insert custom tags** in the TipTap rich text editor with:
   - A unique identifier (ID)
   - Any number of custom parameters (key-value pairs)

2. **Resolve these tags** in your client application to:
   - Render custom buttons, links, widgets, or any HTML element
   - Fetch data dynamically
   - Create interactive UI components

Think of toolcalls as **placeholders** that you define in your content, which
your application can later replace with actual UI elements.

---

## How It Works

### In the Admin Panel

When you insert a toolcall in the editor, it creates a custom HTML tag:

```html
<gitcms-toolcall id="BUTTON" _text="Subscribe" _color="blue"></gitcms-toolcall>
```

**Key Points:**

- `id` attribute identifies the toolcall type
- Parameters are prefixed with `_` to avoid conflicts (e.g., `_text`, `_color`)
- All values are strings

### In the Client SDK

Your application provides **renderer functions** that convert toolcalls into
HTML:

```typescript
const renderers = {
  BUTTON: (id, params) => {
    return `<button class="btn-${params.color}">${params.text}</button>`;
  },
};

const processedContent = resolveToolcalls(content, renderers);
```

---

## Admin Panel Usage

### Inserting a Toolcall

1. Open the rich text editor
2. Click the **⚡ (Zap/Lightning)** icon in the toolbar
3. In the dialog that opens:
   - Enter a **Tool Call ID** (e.g., `BUTTON`, `SUBSCRIBE`, `GOTO`)
   - Add **Parameters** as key-value pairs
   - Click **"Add Parameter"** to add more
   - Preview the tag at the bottom
4. Click **"Insert Tool Call"**

### Visual Appearance

Toolcalls appear in the editor with a purple/violet theme:

- Header shows the ID and a "Tool Call" badge
- Parameters are listed below in a code-like format
- Hovering highlights the toolcall

### Example: Creating a Subscribe Button

**Dialog Inputs:**

- **ID:** `SUBSCRIBE_BUTTON`
- **Parameters:**
  - `text` = `Subscribe to Newsletter`
  - `action` = `newsletter_subscribe`
  - `variant` = `primary`

**Generated Tag:**

```html
<gitcms-toolcall
  id="SUBSCRIBE_BUTTON"
  _text="Subscribe to Newsletter"
  _action="newsletter_subscribe"
  _variant="primary"
></gitcms-toolcall>
```

---

## Client SDK Usage

### Basic Usage

```typescript
import { resolveToolcalls } from '@git-cms/client';

// Your content from GitCMS
const content = `
  <p>Welcome! <gitcms-toolcall id="BUTTON" _text="Get Started" _href="/signup"></gitcms-toolcall></p>
`;

// Define renderers
const toolcallRenderers = {
  BUTTON: (id, params) => {
    return `<a href="${params.href}" class="btn">${params.text}</a>`;
  },
};

// Resolve toolcalls
const processedContent = resolveToolcalls(content, toolcallRenderers);

// Use in your app
document.getElementById('content').innerHTML = processedContent;
```

### Async Renderers

For toolcalls that need to fetch data:

```typescript
import { resolveToolcallsAsync } from '@git-cms/client';

const toolcallRenderers = {
  USER_CARD: async (id, params) => {
    // Fetch user data
    const user = await fetch(`/api/users/${params.userId}`).then(r => r.json());

    return `
      <div class="user-card">
        <img src="${user.avatar}" alt="${user.name}" />
        <h3>${user.name}</h3>
        <p>${user.bio}</p>
      </div>
    `;
  },
};

const processedContent = await resolveToolcallsAsync(
  content,
  toolcallRenderers
);
```

### Fallback Renderer

Handle unknown toolcalls gracefully:

```typescript
const processedContent = resolveToolcalls(content, renderers, {
  fallback: (id, params) => {
    return `<span class="unknown-toolcall" data-id="${id}">⚠️ Unknown: ${id}</span>`;
  },
});
```

### Keep Unresolved Tags

If you want to keep toolcalls without renderers:

```typescript
const processedContent = resolveToolcalls(content, renderers, {
  keepUnresolved: true,
});
```

---

## Examples

### Example 1: Call-to-Action Buttons

**Admin Panel:**

- **ID:** `CTA_BUTTON`
- **Parameters:**
  - `text` = `Start Free Trial`
  - `url` = `/signup`
  - `style` = `primary`

**Client:**

```typescript
const renderers = {
  CTA_BUTTON: (id, params) => {
    const styles = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    };

    return `
      <a href="${params.url}" class="px-6 py-3 rounded-lg font-semibold ${styles[params.style] || styles.primary}">
        ${params.text}
      </a>
    `;
  },
};
```

### Example 2: Dynamic Video Embeds

**Admin Panel:**

- **ID:** `VIDEO_EMBED`
- **Parameters:**
  - `videoId` = `dQw4w9WgXcQ`
  - `platform` = `youtube`
  - `width` = `640`
  - `height` = `360`

**Client:**

```typescript
const renderers = {
  VIDEO_EMBED: (id, params) => {
    const { videoId, platform, width = '640', height = '360' } = params;

    if (platform === 'youtube') {
      return `
        <iframe 
          width="${width}" 
          height="${height}" 
          src="https://www.youtube.com/embed/${videoId}" 
          frameborder="0" 
          allowfullscreen>
        </iframe>
      `;
    }

    if (platform === 'vimeo') {
      return `
        <iframe 
          width="${width}" 
          height="${height}" 
          src="https://player.vimeo.com/video/${videoId}" 
          frameborder="0" 
          allowfullscreen>
        </iframe>
      `;
    }

    return `<p>Unsupported platform: ${platform}</p>`;
  },
};
```

### Example 3: Social Share Buttons

**Admin Panel:**

- **ID:** `SOCIAL_SHARE`
- **Parameters:**
  - `platforms` = `twitter,facebook,linkedin`
  - `text` = `Check out this amazing article!`

**Client:**

```typescript
const renderers = {
  SOCIAL_SHARE: (id, params) => {
    const platforms = params.platforms.split(',');
    const shareText = encodeURIComponent(params.text);
    const currentUrl = encodeURIComponent(window.location.href);

    const buttons = platforms.map(platform => {
      const links = {
        twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`,
      };

      return `
        <a href="${links[platform]}" target="_blank" class="share-btn share-${platform}">
          Share on ${platform.charAt(0).toUpperCase() + platform.slice(1)}
        </a>
      `;
    });

    return `<div class="social-share">${buttons.join('')}</div>`;
  },
};
```

### Example 4: Interactive Navigation

**Admin Panel:**

- **ID:** `GOTO`
- **Parameters:**
  - `section` = `pricing`
  - `text` = `View Pricing`
  - `smooth` = `true`

**Client:**

```typescript
const renderers = {
  GOTO: (id, params) => {
    const button = document.createElement('button');
    button.textContent = params.text;
    button.className = 'goto-button';

    button.onclick = () => {
      const section = document.getElementById(params.section);
      if (section) {
        section.scrollIntoView({
          behavior: params.smooth === 'true' ? 'smooth' : 'auto',
        });
      }
    };

    return button.outerHTML;
  },
};
```

### Example 5: React Components (with dangerouslySetInnerHTML)

**Client (React):**

```tsx
import { resolveToolcalls } from '@git-cms/client';
import { useMemo } from 'react';

function ContentRenderer({ content }) {
  const processedContent = useMemo(() => {
    const renderers = {
      BUTTON: (id, params) => {
        return `
          <button 
            class="btn" 
            data-action="${params.action}"
            onclick="window.handleToolcallAction('${params.action}', '${JSON.stringify(params).replace(/'/g, "\\'")}')">
            ${params.text}
          </button>
        `;
      },
    };

    return resolveToolcalls(content, renderers);
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
}

// In your app setup:
window.handleToolcallAction = (action, paramsJson) => {
  const params = JSON.parse(paramsJson);
  // Handle the action
  console.log('Action triggered:', action, params);
};
```

### Example 6: Vue 3 Components

**Client (Vue 3):**

```vue
<script setup>
import { computed } from 'vue';
import { resolveToolcalls } from '@git-cms/client';

const props = defineProps(['content']);

const processedContent = computed(() => {
  const renderers = {
    ALERT: (id, params) => {
      return `
        <div class="alert alert-${params.type}">
          <strong>${params.title}</strong>
          <p>${params.message}</p>
        </div>
      `;
    },
  };

  return resolveToolcalls(props.content, renderers);
});
</script>

<template>
  <div v-html="processedContent"></div>
</template>
```

---

## Best Practices

### 1. Use Descriptive IDs

✅ **Good:**

```
SUBSCRIBE_BUTTON
USER_PROFILE_CARD
VIDEO_EMBED
```

❌ **Bad:**

```
BTN1
X
THING
```

### 2. Namespace Your Toolcalls

For large projects, use prefixes:

```
BLOG_SHARE_BUTTONS
SHOP_ADD_TO_CART
AUTH_LOGIN_FORM
```

### 3. Validate Parameters

```typescript
const renderers = {
  BUTTON: (id, params) => {
    if (!params.text || !params.href) {
      console.error('BUTTON toolcall missing required params');
      return '<span class="error">Invalid button configuration</span>';
    }

    return `<a href="${params.href}">${params.text}</a>`;
  },
};
```

### 4. Sanitize User Input

```typescript
const escapeHtml = text => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

const renderers = {
  COMMENT: (id, params) => {
    return `
      <div class="comment">
        <strong>${escapeHtml(params.author)}</strong>
        <p>${escapeHtml(params.text)}</p>
      </div>
    `;
  },
};
```

### 5. Provide Fallbacks

Always handle missing renderers gracefully:

```typescript
const processedContent = resolveToolcalls(content, renderers, {
  fallback: (id, params) => {
    console.warn(`No renderer for toolcall: ${id}`);
    return ''; // Or return a placeholder
  },
});
```

### 6. Document Your Toolcalls

Create a reference for content editors:

```markdown
# Available Toolcalls

## BUTTON

Creates a styled button/link

- `text` (required): Button text
- `href` (required): Link URL
- `style` (optional): primary | secondary | outline

## VIDEO_EMBED

Embeds a video

- `videoId` (required): Video ID
- `platform` (required): youtube | vimeo
- `width` (optional): Width in pixels
- `height` (optional): Height in pixels
```

---

## API Reference

### `resolveToolcalls(content, toolcalls, options?)`

Synchronously resolve toolcalls in HTML content.

**Parameters:**

- `content` (string): HTML content with toolcall tags
- `toolcalls` (ToolcallRenderers): Map of toolcall IDs to renderer functions
- `options` (optional):
  - `fallback` (ToolcallRenderer): Fallback renderer for unknown IDs
  - `keepUnresolved` (boolean): Keep unresolved tags (default: false)

**Returns:** `string` - Processed HTML

---

### `resolveToolcallsAsync(content, toolcalls, options?)`

Asynchronously resolve toolcalls (supports async renderers).

**Parameters:** Same as `resolveToolcalls`

**Returns:** `Promise<string>` - Processed HTML

---

### `extractToolcalls(html)`

Extract all toolcall references from HTML.

**Parameters:**

- `html` (string): HTML content

**Returns:** `ToolcallReference[]` - Array of toolcall references

---

### `createElementRenderer(factory)`

Helper to create renderers that return DOM elements.

**Parameters:**

- `factory` (function): Function that creates and returns an HTMLElement

**Returns:** `ToolcallRenderer`

---

### `batchToolcallRenderers(ids, renderer)`

Apply the same renderer to multiple toolcall IDs.

**Parameters:**

- `ids` (string[]): Array of toolcall IDs
- `renderer` (ToolcallRenderer): Renderer function

**Returns:** `ToolcallRenderers`

---

## TypeScript Types

```typescript
interface ToolcallReference {
  id: string;
  parameters: Record<string, string>;
  originalTag: string;
}

type ToolcallRenderer = (
  id: string,
  parameters: Record<string, string>
) => string | HTMLElement | Promise<string | HTMLElement>;

type ToolcallRenderers = Record<string, ToolcallRenderer>;

interface ResolveToolcallsOptions {
  async?: boolean;
  fallback?: ToolcallRenderer;
  keepUnresolved?: boolean;
}
```

---

## Troubleshooting

### Toolcalls not appearing in editor

- Make sure you're using the latest version of the admin panel
- Check browser console for errors

### Toolcalls not being resolved

- Verify the ID matches exactly (case-sensitive)
- Check that the renderer function is returning a string or HTMLElement
- Look for errors in the browser console

### Parameters not being passed correctly

- Remember parameters are always strings
- Use `JSON.parse()` if you need to pass complex data
- Check for special characters that might need escaping

---

## Support

For issues, questions, or feature requests, please visit the
[GitCMS GitHub repository](https://github.com/BestPlayerMMIII/GitCMS).
