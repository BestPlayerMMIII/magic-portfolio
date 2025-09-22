import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, Collaboration, ContentItem } from "../types/index.js";
import dbService from "../services";

const router = Router();

// GET /api/collaborations - Get all collaborations
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const collaborations = await dbService.getCollaborations();

    const response: ApiResponse<ContentItem<Collaboration>[]> = {
      data: collaborations,
      success: true,
      message: "Collaborations retrieved successfully",
    };

    res.json(response);
  })
);

export default router;
