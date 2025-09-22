import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, ContentItem, LearningPath } from "../types/index.js";
import dbService from "../services";

const router = Router();

// GET /api/learning-path - Get all learning paths
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const learningPaths = await dbService.getLearningPaths();

    const response: ApiResponse<ContentItem<LearningPath>[]> = {
      data: learningPaths,
      success: true,
      message: "Learning paths retrieved successfully",
    };

    res.json(response);
  })
);

export default router;
