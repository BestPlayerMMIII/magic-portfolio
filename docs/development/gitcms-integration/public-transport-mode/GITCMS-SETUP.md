# GitCMS Client Installation Guide

## Prerequisites

Before you can run this project, you need to install the GitCMS client library. Since this is your own project, you have several options:

## Option 1: Install from Local Path (Recommended for Development)

If you have the GitCMS project locally:

```bash
# Navigate to your magic-portfolio project
cd c:\Users\Utente\Desktop\Coding\JS-TS\progetti\magic-portfolio

# Install from local path (adjust path to your GitCMS location)
npm install /path/to/gitcms/packages/client

# Example:
# npm install C:\Users\Utente\Desktop\Coding\JS-TS\progetti\gitcms\packages\client
```

## Option 2: Install from GitHub Repository

If GitCMS is pushed to GitHub:

```bash
# Install from GitHub repository
npm install git+https://github.com/yourusername/gitcms.git

# Or if using monorepo with workspaces:
npm install git+https://github.com/yourusername/gitcms.git#workspace=@git-cms/client
```

## Option 3: Publish to npm (Recommended for Production)

If you plan to publish GitCMS to npm:

```bash
# In your GitCMS project
cd packages/client
npm publish

# Then in magic-portfolio
npm install @git-cms/client
```

## Option 4: Use npm link (For Active Development)

If you're actively developing GitCMS alongside this project:

```bash
# In your GitCMS client package
cd /path/to/gitcms/packages/client
npm link

# In your magic-portfolio project
cd c:\Users\Utente\Desktop\Coding\JS-TS\progetti\magic-portfolio
npm link @git-cms/client
```

This creates a symlink, so changes to GitCMS are immediately reflected.

## Verify Installation

After installing, verify it works:

```bash
# Install other dependencies
npm install

# Try to run the dev server
npm run dev
```

If you see import errors, check that:

1. The package is installed in `node_modules/@git-cms/client`
2. The package exports the `GitCMS` class
3. TypeScript types are available

## Update package.json

Once you've decided on an installation method, update `package.json`:

### For Local Path:

```json
{
  "dependencies": {
    "@git-cms/client": "file:../gitcms/packages/client"
  }
}
```

### For GitHub:

```json
{
  "dependencies": {
    "@git-cms/client": "git+https://github.com/yourusername/gitcms.git"
  }
}
```

### For npm:

```json
{
  "dependencies": {
    "@git-cms/client": "^1.0.0"
  }
}
```

## Troubleshooting

### "Cannot find module '@git-cms/client'"

The package isn't installed. Follow one of the installation options above.

### "GitCMS is not exported from '@git-cms/client'"

Check the GitCMS package exports. It should have:

```typescript
// In GitCMS client's index.ts or main file
export { GitCMS } from "./client";
export type { SchemaQuery, ContentItem } from "./types";
```

### TypeScript errors

Make sure the GitCMS package includes type declarations (`.d.ts` files) or has a `types` field in its `package.json`.

### "Module not found" after npm link

Try unlinking and relinking:

```bash
npm unlink @git-cms/client
cd /path/to/gitcms/packages/client
npm link
cd /path/to/magic-portfolio
npm link @git-cms/client
```

## Next Steps

Once GitCMS client is installed:

1. Configure your environment (`.env` file)
2. Run the development server (`npm run dev`)
3. Start building your portfolio!

See `QUICKSTART.md` for the next steps.
