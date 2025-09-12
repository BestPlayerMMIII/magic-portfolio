import { Router, Request, Response } from "express";
import { mockService } from "../services/mockService.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, Project } from "../types/index.js";

const router = Router();

// GET /api/projects - Get all projects
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const projects = await mockService.getProjects();

    const response: ApiResponse<Project[]> = {
      data: projects,
      success: true,
      message: "Projects retrieved successfully",
    };

    res.json(response);
  })
);

// GET /api/projects/:id - Get project by ID
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const project = await mockService.getProjectById(id);

    if (!project) {
      res.status(404).json({
        error: "Not Found",
        message: "Project not found",
        statusCode: 404,
      });
      return;
    }

    const response: ApiResponse<Project> = {
      data: project,
      success: true,
      message: "Project retrieved successfully",
    };

    res.json(response);
  })
);

// POST /api/projects - Create new project
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const projectData = req.body;
    const project = await mockService.createProject(projectData);

    const response: ApiResponse<Project> = {
      data: project,
      success: true,
      message: "Project created successfully",
    };

    res.status(201).json(response);
  })
);

// PUT /api/projects/:id - Update project
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    const project = await mockService.updateProject(id, updates);

    const response: ApiResponse<Project> = {
      data: project,
      success: true,
      message: "Project updated successfully",
    };

    res.json(response);
  })
);

// DELETE /api/projects/:id - Delete project
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await mockService.deleteProject(id);

    const response: ApiResponse<null> = {
      data: null,
      success: true,
      message: "Project deleted successfully",
    };

    res.json(response);
  })
);

export default router;
