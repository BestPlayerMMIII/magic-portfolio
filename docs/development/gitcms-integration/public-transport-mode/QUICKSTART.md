# Quick Start Guide - Public Transport Mode

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set your repository:
   ```bash
   VITE_GITCMS_REPOSITORY=your-username/your-repo
   VITE_GITCMS_BRANCH=main
   ```

## Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Changes

This project now uses **GitCMS Public Transport Mode**:

- ✅ No backend server needed
- ✅ Direct access to public GitHub repositories
- ✅ Simpler deployment (static site only)
- ✅ No API tokens required for public repos

## Architecture

```
Frontend (Vue.js + GitCMS Client) → GitHub API (Public) → Your Content
```

All content is fetched directly from your public GitHub repository.

## Next Steps

1. Set up your GitCMS repository (see GitCMS docs)
2. Configure your categories in `src/config/categories.ts`
3. Run the development server
4. Start creating content!

For detailed migration information, see: `ignore/public-transport-mode/MIGRATION-COMPLETE.md`
