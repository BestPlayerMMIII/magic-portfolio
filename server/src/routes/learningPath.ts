import { Router, Request, Response } from "express";
import { mockService } from "../services/mockService.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, LearningPath } from "../types/index.js";

const router = Router();

// GET /api/learning-path - Get all learning paths
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const learningPaths = await mockService.getLearningPaths();

    const response: ApiResponse<LearningPath[]> = {
      data: learningPaths,
      success: true,
      message: "Learning paths retrieved successfully",
    };

    res.json(response);
  })
);

export default router;
