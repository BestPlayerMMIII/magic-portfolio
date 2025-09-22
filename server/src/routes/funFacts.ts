import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, ContentItem, FunFact } from "../types/index.js";
import dbService from "../services";

const router = Router();

// GET /api/fun-facts - Get all active fun facts
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const funFacts = await dbService.getFunFacts();

    const response: ApiResponse<ContentItem<FunFact>[]> = {
      data: funFacts,
      success: true,
      message: "Fun facts retrieved successfully",
    };

    res.json(response);
  })
);

export default router;
