import { Router, Request, Response } from "express";
import { mockService } from "../services/mockService.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, WorkInProgress } from "../types/index.js";

const router = Router();

// GET /api/wip - Get all work in progress items
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const wipItems = await mockService.getWIPItems();

    const response: ApiResponse<WorkInProgress[]> = {
      data: wipItems,
      success: true,
      message: "Work in progress items retrieved successfully",
    };

    res.json(response);
  })
);

export default router;
