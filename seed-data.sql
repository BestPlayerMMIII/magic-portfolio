-- Sample data for Magic Portfolio
-- Run these SQL commands in your Supabase SQL editor

-- Insert sample projects
INSERT INTO projects (title, description, technologies, github_url, live_url, featured) VALUES
('Magic Portfolio', 'An interactive 3D developer portfolio with magical elements', ARRAY['Vue.js', 'Three.js', 'TypeScript', 'Node.js', 'Supabase'], 'https://github.com/yourname/magic-portfolio', 'https://your-portfolio.vercel.app', true),
('Task Manager Pro', 'A collaborative task management application with real-time updates', ARRAY['React', 'Node.js', 'Socket.io', 'MongoDB'], 'https://github.com/yourname/task-manager', 'https://taskmanager.demo.com', true),
('Weather Wizard', 'A beautiful weather app with animated backgrounds', ARRAY['React Native', 'TypeScript', 'OpenWeather API'], 'https://github.com/yourname/weather-wizard', null, false),
('E-commerce Platform', 'Full-stack e-commerce solution with payment integration', ARRAY['Next.js', 'Stripe', 'PostgreSQL', 'Prisma'], 'https://github.com/yourname/ecommerce', 'https://shop.demo.com', true);

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, tags, published, published_at) VALUES
('Building an Interactive 3D Portfolio with Vue.js and Three.js', 'In this comprehensive guide, I''ll walk you through the process of creating an immersive 3D portfolio...', 'Learn how to create stunning 3D web experiences using Vue.js and Three.js', ARRAY['Vue.js', 'Three.js', 'WebGL', 'Portfolio'], true, NOW() - INTERVAL '7 days'),
('The Magic of TypeScript: Why Every Developer Should Use It', 'TypeScript has revolutionized how I write JavaScript. Here''s why you should consider making the switch...', 'Discover the benefits of TypeScript and how it can improve your development workflow', ARRAY['TypeScript', 'JavaScript', 'Development'], true, NOW() - INTERVAL '14 days'),
('Deploying Full-Stack Applications to Vercel', 'Vercel makes deployment incredibly simple. Here''s my complete guide to deploying full-stack apps...', 'A step-by-step guide to deploying your applications on Vercel', ARRAY['Vercel', 'Deployment', 'DevOps'], true, NOW() - INTERVAL '21 days'),
('My Journey Learning Web Development', 'From complete beginner to professional developer - here''s my story and the lessons I learned...', 'My personal journey and tips for aspiring developers', ARRAY['Career', 'Learning', 'Motivation'], true, NOW() - INTERVAL '30 days');

-- Insert sample work in progress
INSERT INTO work_in_progress (title, description, progress, technologies, expected_completion, priority) VALUES
('AI-Powered Code Assistant', 'Building an intelligent coding companion that helps with code completion and debugging', 75, ARRAY['Python', 'OpenAI', 'FastAPI', 'React'], CURRENT_DATE + INTERVAL '2 months', 'high'),
('Real-time Collaboration Tool', 'A Figma-like collaborative design tool for developers', 45, ARRAY['Vue.js', 'Socket.io', 'Canvas API', 'Node.js'], CURRENT_DATE + INTERVAL '4 months', 'medium'),
('Mobile App Portfolio', 'Converting my web portfolio into a native mobile experience', 30, ARRAY['React Native', 'Expo', 'Three.js'], CURRENT_DATE + INTERVAL '3 months', 'medium'),
('Open Source UI Library', 'Creating a comprehensive Vue.js component library', 60, ARRAY['Vue.js', 'Storybook', 'TypeScript', 'Vite'], CURRENT_DATE + INTERVAL '6 weeks', 'high');

-- Insert sample collaborations
INSERT INTO collaborations (title, description, collaborators, status, technologies, github_url) VALUES
('Green Tech Startup MVP', 'Building a sustainability tracking platform for small businesses', ARRAY['Sarah Chen', 'Mike Rodriguez', 'Alex Kim'], 'active', ARRAY['React', 'Node.js', 'PostgreSQL', 'AWS'], 'https://github.com/greentech/mvp'),
('Open Source Design System', 'Contributing to a popular design system used by thousands of developers', ARRAY['Design System Team', 'Community Contributors'], 'active', ARRAY['React', 'TypeScript', 'Storybook', 'Figma'], 'https://github.com/design-system/core'),
('Hackathon Winner - EduTech', 'Educational platform that won first place at TechCrunch Disrupt', ARRAY['Jenny Wilson', 'David Park'], 'completed', ARRAY['Vue.js', 'Firebase', 'Machine Learning'], 'https://github.com/edutech/platform'),
('Community Learning Platform', 'Free platform for coding bootcamp graduates to continue learning', ARRAY['Coding Bootcamp Alumni', 'Volunteer Mentors'], 'planning', ARRAY['Next.js', 'Supabase', 'Stripe'], null);

-- Insert sample learning paths
INSERT INTO learning_paths (title, description, category, difficulty, progress, resources) VALUES
('Advanced Three.js & WebGL', 'Master 3D graphics programming for the web', 'Frontend Development', 'advanced', 80, 
'[
  {"id": "1", "title": "Three.js Fundamentals", "type": "course", "url": "https://threejs-journey.com", "completed": true},
  {"id": "2", "title": "WebGL Programming Guide", "type": "book", "completed": true},
  {"id": "3", "title": "Shader Programming", "type": "tutorial", "url": "https://thebookofshaders.com", "completed": false},
  {"id": "4", "title": "Advanced Lighting Techniques", "type": "video", "completed": false}
]'::jsonb),
('Node.js Backend Architecture', 'Learn to build scalable backend systems', 'Backend Development', 'intermediate', 65,
'[
  {"id": "1", "title": "Node.js Design Patterns", "type": "book", "completed": true},
  {"id": "2", "title": "Microservices with Node.js", "type": "course", "completed": true},
  {"id": "3", "title": "Database Design & Optimization", "type": "course", "completed": false},
  {"id": "4", "title": "GraphQL API Development", "type": "tutorial", "completed": false}
]'::jsonb),
('Machine Learning for Web Developers', 'Integrate ML models into web applications', 'Machine Learning', 'beginner', 35,
'[
  {"id": "1", "title": "TensorFlow.js Basics", "type": "course", "url": "https://www.tensorflow.org/js", "completed": true},
  {"id": "2", "title": "ML5.js Creative Coding", "type": "tutorial", "completed": false},
  {"id": "3", "title": "Computer Vision in the Browser", "type": "course", "completed": false},
  {"id": "4", "title": "AI Ethics for Developers", "type": "documentation", "completed": false}
]'::jsonb),
('DevOps & Cloud Deployment', 'Master modern deployment and infrastructure', 'DevOps', 'intermediate', 50,
'[
  {"id": "1", "title": "Docker & Containerization", "type": "course", "completed": true},
  {"id": "2", "title": "Kubernetes Fundamentals", "type": "course", "completed": false},
  {"id": "3", "title": "AWS Solutions Architect", "type": "course", "completed": false},
  {"id": "4", "title": "CI/CD Pipeline Design", "type": "tutorial", "completed": true}
]'::jsonb);

-- Insert sample fun facts
INSERT INTO fun_facts (content, category, is_active) VALUES
('I once debugged a critical production issue while on a rollercoaster at Six Flags!', 'personal', true),
('My first "Hello World" program was written on a Nokia 3310 using Snake game score manipulation', 'personal', true),
('I can solve a Rubik''s cube in under 2 minutes, which surprisingly helps with algorithm thinking', 'personal', true),
('The longest I''ve ever spent debugging was 8 hours, only to find it was a missing semicolon in CSS', 'technical', true),
('I''ve contributed to 47 open source projects, but my most popular contribution was fixing a typo in documentation', 'technical', true),
('My code editor theme changes based on the time of day - dark mode after sunset, light mode during the day', 'technical', true),
('I once named all my variables after Harry Potter characters in a project, and it somehow made the code more readable', 'random', true),
('My rubber duck debugging companion is actually a rubber dragon named "Debuggon"', 'random', true),
('I learned to code because I wanted to automate my Plants vs. Zombies gameplay', 'random', true),
('My most used keyboard shortcut is Ctrl+Z, followed closely by Ctrl+Shift+Z', 'technical', true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at);
CREATE INDEX IF NOT EXISTS idx_wip_priority ON work_in_progress(priority);
CREATE INDEX IF NOT EXISTS idx_collaborations_status ON collaborations(status);
CREATE INDEX IF NOT EXISTS idx_learning_paths_category ON learning_paths(category);
CREATE INDEX IF NOT EXISTS idx_fun_facts_active ON fun_facts(is_active);

-- Sample queries for testing
-- SELECT * FROM projects WHERE featured = true;
-- SELECT * FROM blog_posts WHERE published = true ORDER BY published_at DESC;
-- SELECT * FROM work_in_progress ORDER BY priority DESC, progress ASC;
-- SELECT * FROM fun_facts WHERE is_active = true ORDER BY RANDOM() LIMIT 5;
