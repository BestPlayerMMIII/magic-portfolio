import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, ContentItem, Project } from "../types/index.js";
import dbService from "../services";

const router = Router();

// GET /api/projects - Get all projects
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const projects = await dbService.getProjects();

    const response: ApiResponse<ContentItem<Project>[]> = {
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
    const project = await dbService.getProjectById(id);

    if (!project) {
      res.status(404).json({
        error: "Not Found",
        message: "Project not found",
        statusCode: 404,
      });
      return;
    }

    const response: ApiResponse<ContentItem<Project>[]> = {
      data: [project],
      success: true,
      message: "Project retrieved successfully",
    };

    res.json(response);
  })
);

export default router;
