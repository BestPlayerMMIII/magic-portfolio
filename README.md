# 🔮 Magic Portfolio - Interactive Developer Showcase

An immersive 3D developer portfolio that presents your projects, blog posts, work-in-progress items, collaborations, learning paths, and fun facts through an interactive wizard laboratory environment.

## ✨ Features

- **🎭 Interactive 3D Environment**: Navigate through a magical laboratory with floating crystals, alchemy cauldrons, mystical books, and more
- **📊 Content Management**: Connect to Supabase or Notion to manage all your portfolio content
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
│   │   ├── 📁 services/       # Supabase/database services
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
- Supabase account (or Notion API access)

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

Edit `.env` with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 3. Database Setup (Supabase)

Create the following tables in your Supabase database:

#### Projects Table

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[],
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Blog Posts Table

```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Work in Progress Table

```sql
CREATE TABLE work_in_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  technologies TEXT[],
  expected_completion DATE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Collaborations Table

```sql
CREATE TABLE collaborations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  collaborators TEXT[],
  status TEXT CHECK (status IN ('planning', 'active', 'completed', 'paused')),
  technologies TEXT[],
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Learning Paths Table

```sql
CREATE TABLE learning_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  resources JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Fun Facts Table

```sql
CREATE TABLE fun_facts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('personal', 'technical', 'random')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

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

## 📊 Content Management

### Sample Data

Insert some sample data to test your portfolio:

```sql
-- Sample Project
INSERT INTO projects (title, description, technologies, featured) VALUES
('Magic Portfolio', 'An interactive 3D developer portfolio', ARRAY['Vue.js', 'Three.js', 'TypeScript', 'Node.js'], true);

-- Sample Blog Post
INSERT INTO blog_posts (title, content, excerpt, tags, published, published_at) VALUES
('Building an Interactive Portfolio', 'Full content here...', 'Learn how I built this magical portfolio', ARRAY['development', 'vue', 'threejs'], true, NOW());

-- Sample WIP
INSERT INTO work_in_progress (title, description, progress, technologies, priority) VALUES
('AI-Powered Code Assistant', 'Building a smart coding companion', 75, ARRAY['Python', 'OpenAI', 'FastAPI'], 'high');

-- Sample Fun Fact
INSERT INTO fun_facts (content, category) VALUES
('I once debugged a critical production issue while on a rollercoaster!', 'personal');
```

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
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
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
- **Supabase**: Backend-as-a-Service database
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
