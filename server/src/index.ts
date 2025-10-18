import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler.js";
import projectsRouter from "./routes/projects.js";
import blogRouter from "./routes/blog.js";
import wipRouter from "./routes/wip.js";
import collaborationsRouter from "./routes/collaborations.js";
import learningPathRouter from "./routes/learningPath.js";
import funFactsRouter from "./routes/funFacts.js";
import mediaRouter from "./routes/media.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        mediaSrc: ["'self'", "data:", "blob:", "https:"],
      },
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
    },
    success: true,
    message: "Server is running successfully",
  });
});

// API Routes
app.use("/api/projects", projectsRouter);
app.use("/api/blog", blogRouter);
app.use("/api/wip", wipRouter);
app.use("/api/collaborations", collaborationsRouter);
app.use("/api/learning-path", learningPathRouter);
app.use("/api/fun-facts", funFactsRouter);
app.use("/api/media", mediaRouter);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Magic Portfolio Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
