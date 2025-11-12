# 🚀 GitCMS Toolcalls Feature

**Quick Start Guide**

## What is it?

Toolcalls let you embed **interactive, dynamic elements** in your GitCMS content
that can be rendered however you want in your application.

Think of them as **smart placeholders** that you define in the admin panel and
bring to life in your app.

---

## Quick Example

### 1. In Admin Panel (Content Creation)

Click the ⚡ button in the editor toolbar, then:

**Input:**

- ID: `BUTTON`
- Parameters:
  - `text` = `Get Started`
  - `href` = `/signup`

**Generated:**

```html
<gitcms-toolcall
  id="BUTTON"
  _text="Get Started"
  _href="/signup"
></gitcms-toolcall>
```

### 2. In Your App (Rendering)

```typescript
import { resolveToolcalls } from '@git-cms/client';

const content = article.body; // Contains the toolcall tag

const renderers = {
  BUTTON: (id, params) => {
    return `<a href="${params.href}" class="btn">${params.text}</a>`;
  },
};

const html = resolveToolcalls(content, renderers);
// Result: <a href="/signup" class="btn">Get Started</a>
```

---

## Why Use Toolcalls?

✅ **Flexible:** Embed any UI element (buttons, videos, forms, cards, etc.)  
✅ **Dynamic:** Fetch data async and render it  
✅ **Type-Safe:** Full TypeScript support  
✅ **Framework Agnostic:** Works with React, Vue, vanilla JS, etc.  
✅ **Easy to Use:** Simple API on both sides

---

## Common Use Cases

| Toolcall ID       | Purpose                | Parameters                               |
| ----------------- | ---------------------- | ---------------------------------------- |
| `BUTTON`          | Call-to-action buttons | `text`, `href`, `style`                  |
| `VIDEO_EMBED`     | Embed videos           | `platform`, `videoId`, `width`, `height` |
| `NEWSLETTER_FORM` | Subscription forms     | `buttonText`, `placeholder`              |
| `USER_CARD`       | Display user profiles  | `userId`                                 |
| `PRODUCT_GRID`    | Show products          | `category`, `limit`                      |
| `SHARE_BUTTONS`   | Social sharing         | `platforms`, `text`                      |
| `ALERT`           | Notifications/alerts   | `type`, `title`, `message`               |

---

## Advanced Features

### Async Renderers (Fetch Data)

```typescript
import { resolveToolcallsAsync } from '@git-cms/client';

const renderers = {
  USER_CARD: async (id, params) => {
    const user = await fetchUser(params.userId);
    return `<div class="card">${user.name}</div>`;
  },
};

const html = await resolveToolcallsAsync(content, renderers);
```

### Fallback Handler

```typescript
const html = resolveToolcalls(content, renderers, {
  fallback: (id, params) => {
    return `<span class="error">Unknown toolcall: ${id}</span>`;
  },
});
```

### Interactive Elements

```typescript
const renderers = {
  GOTO_BUTTON: (id, params) => {
    const btn = document.createElement('button');
    btn.textContent = params.text;
    btn.onclick = () => {
      document
        .getElementById(params.target)
        ?.scrollIntoView({ behavior: 'smooth' });
    };
    return btn.outerHTML;
  },
};
```

---

## Documentation

📖 **Full Guide:** [docs/TOOLCALLS-GUIDE.md](./docs/TOOLCALLS-GUIDE.md)  
💡 **Examples:** [examples/toolcalls-usage.ts](./examples/toolcalls-usage.ts)

---

## Files Modified/Created

### Admin Panel (packages/admin)

- ✅ `src/lib/tiptap-toolcall-extension.ts` - TipTap custom extension
- ✅ `src/components/content/toolcall-dialog.tsx` - UI for inserting toolcalls
- ✅ `src/components/content/rich-text-editor.tsx` - Integrated toolbar button &
  styling

### Client SDK (packages/client)

- ✅ `src/toolcalls.ts` - Complete toolcalls API
- ✅ `src/index.ts` - Exported from main package

### Documentation

- ✅ `docs/TOOLCALLS-GUIDE.md` - Comprehensive guide
- ✅ `examples/toolcalls-usage.ts` - Code examples
- ✅ `ignore/toolcalls/requests.md` - Implementation notes

---

## API Reference (Quick)

### Main Functions

```typescript
// Sync resolution
resolveToolcalls(
  content: string,
  toolcalls: ToolcallRenderers,
  options?: ResolveToolcallsOptions
): string

// Async resolution
resolveToolcallsAsync(
  content: string,
  toolcalls: ToolcallRenderers,
  options?: ResolveToolcallsOptions
): Promise<string>

// Extract toolcalls
extractToolcalls(html: string): ToolcallReference[]
```

### Types

```typescript
type ToolcallRenderer = (
  id: string,
  parameters: Record<string, string>
) => string | HTMLElement | Promise<string | HTMLElement>;

type ToolcallRenderers = Record<string, ToolcallRenderer>;

interface ToolcallReference {
  id: string;
  parameters: Record<string, string>;
  originalTag: string;
}
```

---

## Need Help?

- 📖 Read the [full guide](./docs/TOOLCALLS-GUIDE.md)
- 💡 Check [examples](./examples/toolcalls-usage.ts)
- 🐛 [Open an issue](https://github.com/BestPlayerMMIII/GitCMS/issues)

---

**Made with ❤️ for GitCMS**
