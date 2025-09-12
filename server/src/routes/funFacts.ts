import { Router, Request, Response } from "express";
import { mockService } from "../services/mockService.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, FunFact } from "../types/index.js";

const router = Router();

// GET /api/fun-facts - Get all active fun facts
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const funFacts = await mockService.getFunFacts();

    const response: ApiResponse<FunFact[]> = {
      data: funFacts,
      success: true,
      message: "Fun facts retrieved successfully",
    };

    res.json(response);
  })
);

export default router;
