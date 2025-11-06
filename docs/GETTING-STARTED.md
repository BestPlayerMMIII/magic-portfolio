# 🚀 Getting Started with Magic Portfolio

This guide will walk you through setting up your own Magic Portfolio from scratch, including GitCMS integration for content management.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [GitCMS Configuration](#gitcms-configuration)
- [Content Structure](#content-structure)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and **npm** installed ([Download](https://nodejs.org/))
- A **GitHub account** ([Sign up](https://github.com/join))
- **Git** installed locally ([Download](https://git-scm.com/))
- A code editor (we recommend [VS Code](https://code.visualstudio.com/))

## Initial Setup

### 1. Create Your Repository

Click the **"Use this template"** button on the [Magic Portfolio repository](https://github.com/BestPlayerMMIII/magic-portfolio) to create your own copy.

**Options:**

- ✅ Include all branches (recommended for deployment setup)
- Repository name: Choose something like `my-portfolio` or `your-name-portfolio`
- Visibility: private or public, your choice!

### 2. Clone Your Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 3. Install Dependencies

```bash
npm install
```

This will install:

- Vue 3.5+ - Frontend framework
- Three.js 0.157+ - 3D graphics engine
- Vite 7+ - Build tool and dev server
- GitCMS - Content management system
- Tailwind CSS - Styling framework
- TypeScript 5+ - Type safety

## GitCMS Configuration

GitCMS is a Git-based content management system that uses GitHub repositories to store your content. No database required!

### Option 1: Public Repository (Recommended for Beginners)

**Advantages:**

- ✅ Free and simple
- ✅ No authentication required
- ✅ Easy to set up

**Limitations:**

- ⚠️ All content is publicly visible on GitHub
- ⚠️ Rate-limited API calls (60 requests/hour without auth)

#### Steps:

1. **Create a content repository** on GitHub (e.g., `my-portfolio-content`)
2. **Make it public**
3. **Access GitCMS Admin Panel**: https://gitcms.bestplayer.dev
4. **Follow the Admin Panel flow**:

   - Connect your content repository
   - Create schemas (or import them from "BestPlayerMMIII/gitcms-magic-portfolio")
   - Create contents based on the schemas
   - Done!

5. **Configure your portfolio** - Create `.env` file:

```env
VITE_GITCMS_REPOSITORY=YOUR_USERNAME/my-portfolio-content
VITE_GITCMS_BRANCH=main
```

### Option 2: Private Repository (Advanced)

**Advantages:**

- ✅ Content remains private
- ✅ Higher API rate limits with authentication
- ✅ Better for professional/commercial use

**Requirements:**

- GitHub Personal Access Token

#### Steps:

1. **Create a content repository** (keep it private)
2. **Configure it in Admin Panel** (same as above)
3. **Generate a GitHub token:**

   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (Full control of private repositories)
   - Copy the token (you won't see it again!)

   Note: it can be also fine-grained, with:

   - Repository access = Only select repositories (select only your "my-portfolio-content" repository)
   - Permissions = Contents \[Access: Read-Only\], Metadata \[Required\]

4. **Configure with authentication:**

```env
VITE_GITCMS_REPOSITORY=YOUR_USERNAME/my-portfolio-content
VITE_GITCMS_BRANCH=main
GITCMS_TOKEN=ghp_yourTokenHere123456789
```

⚠️ **Security Warning:** Never commit `.env` to Git! It's already in `.gitignore`.

## Content

Manage your contents directly on the intuitive [GitCMS Admin Panel](https://gitcms.bestplayer.dev)!

## Local Development

### Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your portfolio.

### Development Workflow

1. **Edit content** in your GitCMS repository
2. **Refresh** your browser - changes appear automatically (cached for 5 minutes)
3. **Customize** components in `src/components/`
4. **Modify theme** in `src/themes/wizard-lab/`

### Hot Module Replacement (HMR)

Vite provides instant feedback when you edit:

- Vue components
- TypeScript files
- CSS/Tailwind classes

No need to refresh manually!

## Deployment

### GitHub Pages (Automatic)

The repository includes a GitHub Actions workflow for automatic deployment.

#### Enable GitHub Pages:

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - Source: **GitHub Actions**
4. Push to `main` branch - deployment starts automatically!

#### Custom Domain (Optional):

1. Add a `CNAME` file to `public/` folder:

   ```
   portfolio.yourdomain.com
   ```

2. Configure DNS with your domain provider:

   ```
   Type: CNAME
   Name: portfolio
   Value: YOUR_USERNAME.github.io
   ```

3. In GitHub Settings → Pages, add your custom domain

### Manual Deployment

Build for production:

```bash
npm run build
```

The `dist/` folder contains your production-ready site. Deploy it to:

- **Netlify:** Drag & drop the `dist` folder
- **Vercel:** Connect your GitHub repository
- **Any static hosting:** Upload `dist/` contents

## Troubleshooting

### Common Issues

#### ❌ "Failed to fetch content from GitCMS"

**Causes:**

- Repository name is incorrect in `.env`
- Repository is private but no token provided
- Branch name is wrong
- Content folders don't exist

**Solution:**

```bash
# Verify your .env file
cat .env

# Check repository exists and is accessible
curl https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO
```

#### ❌ "Rate limit exceeded"

**Cause:** GitHub API limits unauthenticated requests to 60/hour

**Solution:** Add authentication token to `.env`:

```env
GITCMS_TOKEN=ghp_yourToken
```

#### ❌ "3D models not loading"

**Causes:**

- Model files missing from `public/assets/models/`
- Model files are too large (>5MB recommended)
- Wrong file format (needs `.glb`)

**Solution:**

- Download models from [Sketchfab](https://sketchfab.com/)
- Optimize with [gltf.report](https://gltf.report/)
- Place in `public/assets/models/`

#### ❌ "White screen on mobile"

**Cause:** Mobile devices redirected to `/about` if 3D scene fails to load

**Solution:** Check browser console for errors. Ensure:

- Three.js is installed correctly
- WebGL is supported on the device

### Getting Help

- **Issues:** [GitHub Issues](../../issues)
- **Discussions:** [GitHub Discussions](../../discussions)
- **Documentation:** Check other guides in `docs/`

## Next Steps

✅ You now have a working Magic Portfolio!

**What's next?**

1. 📝 **Add more content** to your GitCMS repository
2. 🎨 **Customize the theme** - See [Creating Themes](./CREATING-THEMES.md)
3. 🖼️ **Add 3D models** - Download free models from Sketchfab
4. 🚀 **Deploy** and share your portfolio!

---

Need help? [Open an issue](../../issues) or check our [Contributing Guide](../CONTRIBUTING.md)!
