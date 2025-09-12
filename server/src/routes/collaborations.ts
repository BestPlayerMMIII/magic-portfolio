import { Router, Request, Response } from "express";
import { mockService } from "../services/mockService.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, Collaboration } from "../types/index.js";

const router = Router();

// GET /api/collaborations - Get all collaborations
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const collaborations = await mockService.getCollaborations();

    const response: ApiResponse<Collaboration[]> = {
      data: collaborations,
      success: true,
      message: "Collaborations retrieved successfully",
    };

    res.json(response);
  })
);

export default router;
