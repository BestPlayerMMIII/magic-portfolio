# 🔮 Magic Portfolio - Interactive Developer Showcase

An immersive 3D developer portfolio that presents your projects, blog posts, work-in-progress items, collaborations, learning paths, and fun facts through an interactive wizard laboratory environment.

## ✨ Features

- **🎭 Interactive 3D Environment**: Navigate through a magical laboratory with floating crystals, alchemy cauldrons, mystical books, and more
- **📊 Content Management**: Powered by GitCMS - a custom Git-based content management solution
- **🎨 Modern Tech Stack**: Vue 3 + TypeScript frontend, Node.js + TypeScript backend
- **🎪 Interactive Objects**:
  - 💎 **Floating Crystal** → Projects
  - ⚗️ **Alchemy Cauldron** → Work in Progress
  - 📖 **Mystical Book** → Blog Posts
  - 🔮 **Magic Circle** → Collaborations
  - 📚 **Glowing Library** → Learning Paths
  - 🦉 **Animated Owl** → Fun Facts
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🚀 Easy Deployment**: Ready for Vercel deployment with included configuration

## 🏗️ Project Structure

```
magic-portfolio/
├── 📁 server/                 # Backend API (Node.js + TypeScript)
│   ├── 📁 src/
│   │   ├── 📄 index.ts        # Main server file
│   │   ├── 📁 routes/         # API routes for all content types
│   │   ├── 📁 services/       # GitCMS database services
│   │   ├── 📁 middleware/     # Error handling, validation
│   │   └── 📁 types/          # TypeScript type definitions
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
├── 📁 src/                    # Frontend (Vue 3 + TypeScript + Three.js)
│   ├── 📄 main.ts            # App entry point
│   ├── 📄 App.vue            # Main app component
│   ├── 📁 scenes/            # 3D scenes and environments
│   │   └── 📄 MagicLaboratory.vue
│   ├── 📁 components/        # Reusable Vue components
│   │   └── 📄 ContentModal.vue
│   ├── 📁 services/          # API communication
│   ├── 📁 types/             # TypeScript interfaces
│   └── 📁 assets/            # Static assets, 3D models
├── 📁 public/                # Static files
├── 📄 package.json           # Root dependencies
├── 📄 vite.config.ts         # Vite configuration
├── 📄 tailwind.config.js     # TailwindCSS configuration
├── 📄 vercel.json            # Vercel deployment config
└── 📄 .env.example           # Environment variables template
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- GitCMS repository set up (see [GitCMS documentation](https://github.com/BestPlayerMMIII/gitcms))

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd magic-portfolio
npm install
```

### 2. Environment Setup

Copy the environment template and configure your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your GitCMS credentials:

```env
# GitCMS Configuration
GITCMS_REPOSITORY=username/repo
GITCMS_BRANCH=main
GITCMS_TOKEN=your_github_token_here

# Server Configuration
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 3. Content Setup with GitCMS

GitCMS is a Git-based content management system that stores your portfolio content in a GitHub repository. Follow the [GitCMS documentation](https://github.com/BestPlayerMMIII/gitcms) to set up your content repository with the required schemas for:

- Projects
- Blog Posts
- Work in Progress items
- Collaborations
- Learning Paths
- Fun Facts

### 4. Development

Start both frontend and backend in development mode:

```bash
npm run dev
```

This will start:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### 5. Building for Production

```bash
npm run build
```

## � Documentation

For comprehensive guides, architecture details, and development workflows, check out our organized documentation:

**[📖 Complete Documentation Hub](./docs/README.md)**

### Quick Links

- **[🎯 Setup Guides](./docs/guides/)** - Step-by-step configuration guides
- **[🎭 3D Models Guide](./docs/guides/3d-models/)** - 3D model setup and requirements
- **[✨ Effects Guides](./docs/guides/effects/)** - Advanced effects and lighting configuration
- **[🏗️ Architecture](./docs/architecture/)** - System design and technical documentation
- **[🔧 Development](./docs/development/)** - Development workflows and checklists

## 📊 Content Management with GitCMS

This portfolio uses **GitCMS**, a custom Git-based content management system that stores all your portfolio content in a GitHub repository. This approach provides:

- **Version Control**: All content changes are tracked in Git
- **No Database Required**: Content is stored as structured files in your repository
- **Easy Backups**: Your content is automatically backed up through Git
- **Developer-Friendly**: Edit content using your favorite text editor or through a custom CMS interface

For setup instructions and schema definitions, see the [GitCMS documentation](https://github.com/BestPlayerMMIII/gitcms).

## 🎨 Customization

### Adding New Interactive Objects

1. Update `InteractiveObject` type in `src/types/index.ts`
2. Add new object creation logic in `MagicLaboratory.vue`
3. Create corresponding API endpoints in the backend
4. Update the modal component to handle new content types

### Styling

The project uses TailwindCSS with custom magical color schemes:

- `magic-*`: Blue-purple gradient colors
- `mystical-*`: Pink-purple gradient colors

### 3D Models

Replace placeholder geometries with custom 3D models by:

1. Adding `.glb` or `.gltf` files to `public/assets/`
2. Using Three.js GLTFLoader to load models
3. Updating the `createObjectMesh` function

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Set these in your Vercel dashboard:

```
GITCMS_REPOSITORY=username/repo
GITCMS_BRANCH=main
GITCMS_TOKEN=your_github_token
CORS_ORIGIN=https://your-domain.vercel.app
NODE_ENV=production
```

## 🛠️ API Endpoints

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Blog Posts

- `GET /api/blog` - Get all published posts
- `GET /api/blog/:id` - Get post by ID

### Work in Progress

- `GET /api/wip` - Get all WIP items

### Collaborations

- `GET /api/collaborations` - Get all collaborations

### Learning Paths

- `GET /api/learning-path` - Get all learning paths

### Fun Facts

- `GET /api/fun-facts` - Get all active fun facts

### Health Check

- `GET /api/health` - Server health status

## 🔧 Technologies Used

### Frontend

- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe JavaScript
- **Three.js**: 3D graphics and animations
- **TailwindCSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server

### Backend

- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **TypeScript**: Type-safe JavaScript
- **GitCMS**: Custom Git-based content management system
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware

### Deployment

- **Vercel**: Serverless deployment platform

## 📝 License

MIT License - feel free to use this project as a template for your own magical portfolio!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub.

---

**Happy coding, and may your portfolio be magical! 🔮✨**
