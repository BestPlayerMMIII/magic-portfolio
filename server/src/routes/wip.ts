import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, ContentItem, WorkInProgress } from "../types/index.js";
import dbService from "../services";

const router = Router();

// GET /api/wip - Get all work in progress items
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const wipItems = await dbService.getWIPItems();

    const response: ApiResponse<ContentItem<WorkInProgress>[]> = {
      data: wipItems,
      success: true,
      message: "Work in progress items retrieved successfully",
    };

    res.json(response);
  })
);

export default router;
