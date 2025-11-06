# Contributing to Magic Portfolio

First off, thank you for considering contributing to Magic Portfolio! 🎉

It's people like you that make Magic Portfolio such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to provide a welcoming and inspiring community for all.

**Our Standards:**

- ✅ Be respectful and inclusive
- ✅ Welcome newcomers and encourage diverse perspectives
- ✅ Focus on what is best for the community
- ✅ Show empathy towards other community members

**Unacceptable Behavior:**

- ❌ Harassment, trolling, or derogatory comments
- ❌ Publishing others' private information
- ❌ Other conduct which could reasonably be considered inappropriate

## How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the [existing issues](../../issues) to avoid duplicates.

**When submitting a bug report, include:**

- A clear and descriptive title
- Steps to reproduce the problem
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node.js version)
- Relevant error messages or console logs

**Template:**

```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**

1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**

- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node.js: [e.g., 18.17.0]
```

### Suggesting Enhancements 💡

Enhancement suggestions are tracked as [GitHub issues](../../issues).

**When suggesting an enhancement:**

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- List any alternatives you've considered
- Include mockups or examples if applicable

### Contributing Code 🔧

**Types of contributions we welcome:**

- 🐛 Bug fixes
- ✨ New features
- 🎨 New themes
- 📝 Documentation improvements
- ♿ Accessibility improvements
- 🌍 Internationalization (i18n)
- ⚡ Performance optimizations

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### Setup Steps

1. **Fork the repository** on GitHub

2. **Clone your fork:**

```bash
git clone https://github.com/YOUR_USERNAME/magic-portfolio.git
cd magic-portfolio
```

3. **Add upstream remote:**

```bash
git remote add upstream https://github.com/BestPlayerMMIII/magic-portfolio.git
```

4. **Install dependencies:**

```bash
npm install
```

5. **Create a branch:**

```bash
git checkout -b feature/your-feature-name
```

6. **Start development server:**

```bash
npm run dev
```

### Project Structure

Key directories to know:

```
src/
├── components/     # Vue components
├── scenes/         # Main scene views
├── services/       # Business logic & API
│   └── core/       # 3D scene management
├── themes/         # Theme configurations
├── stores/         # Pinia state stores
└── types/          # TypeScript definitions
```

## Coding Guidelines

### TypeScript

- ✅ Use TypeScript for all new files
- ✅ Avoid `any` types - use proper typing
- ✅ Define interfaces in `src/types/`
- ✅ Use meaningful variable and function names

**Example:**

```typescript
// ❌ Bad
function fn(x: any) {
  return x.y;
}

// ✅ Good
interface User {
  name: string;
  email: string;
}

function getUserEmail(user: User): string {
  return user.email;
}
```

### Vue Components

- ✅ Use Composition API with `<script setup>`
- ✅ Use TypeScript in script sections
- ✅ Extract reusable logic to composables
- ✅ Keep components focused and single-purpose

**Example:**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

const isActive = ref(false);
const displayCount = computed(() => props.count + 1);
</script>

<template>
  <div>{{ title }}: {{ displayCount }}</div>
</template>
```

### CSS/Tailwind

- ✅ Use Tailwind utility classes where possible
- ✅ Extract repeated patterns to components
- ✅ Use CSS variables for theme-able values
- ✅ Ensure responsive design (mobile-first)

### Three.js Code

- ✅ Dispose of geometries and materials when done
- ✅ Use object pools for frequently created objects
- ✅ Optimize geometry complexity
- ✅ Use texture compression

**Example:**

```typescript
// ✅ Good - proper cleanup
onUnmounted(() => {
  geometry.dispose();
  material.dispose();
  renderer.dispose();
});
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Examples

```bash
# New feature
git commit -m "feat(themes): add cyberpunk theme"

# Bug fix
git commit -m "fix(3d): prevent memory leak in model loader"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api)!: change gitcms configuration format

BREAKING CHANGE: GitCMS config now requires schema path"
```

### Scope

Optional but recommended. Common scopes:

- `3d` - Three.js related
- `theme` - Theme system
- `api` - API/service layer
- `ui` - UI components
- `store` - State management
- `build` - Build system
- `docs` - Documentation

## Pull Request Process

### Before Submitting

1. **Update from upstream:**

```bash
git fetch upstream
git rebase upstream/main
```

2. **Run linter:**

```bash
npm run lint
```

3. **Build the project:**

```bash
npm run build
```

4. **Test your changes:**

- Test in development mode
- Test the production build
- Test on mobile devices
- Check browser console for errors

5. **Update documentation:**

- Update README if needed
- Add JSDoc comments to new functions
- Update relevant guides in `docs/`

### Submitting the PR

1. **Push to your fork:**

```bash
git push origin feature/your-feature-name
```

2. **Create Pull Request** on GitHub

3. **Fill out the PR template:**

```markdown
## Description

Brief description of what this PR does.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tested in development mode
- [ ] Tested production build
- [ ] Tested on mobile
- [ ] No console errors

## Screenshots

If applicable, add screenshots.

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings introduced
```

### PR Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge it
4. Your contribution will be included in the next release! 🎉

### After Your PR is Merged

1. **Delete your branch:**

```bash
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

2. **Update your local main:**

```bash
git checkout main
git pull upstream main
```

## Recognition

Contributors are automatically added to our [contributors list](../../graphs/contributors).

Significant contributors may be featured in:

- README credits section
- Release notes
- Project documentation

## Questions?

- 💬 [Start a discussion](../../discussions)
- 🐛 [Open an issue](../../issues)
- 📧 Contact the maintainer

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Magic Portfolio! 🌟
