import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse } from "../types/index.js";
import { mediaService } from "../services";

const router = Router();

// POST /api/media/process-content - Process HTML content with media
router.post(
  "/process-content",
  asyncHandler(async (req: Request, res: Response) => {
    const { content, full = false } = req.body;

    if (!content) {
      res.status(400).json({
        error: "Bad Request",
        message: "Content is required",
        statusCode: 400,
      });
      return;
    }

    let processedContent: string;

    if (full) {
      // Full resolution (async)
      processedContent = await mediaService.renderFull(content);
    } else {
      // Fast version with thumbnails
      processedContent = mediaService.renderFast(content);
    }

    const response: ApiResponse<{ content: string }> = {
      data: { content: processedContent },
      success: true,
      message: "Content processed successfully",
    };

    res.json(response);
  })
);

// POST /api/media/fetch-full - Fetch full resolution for a media field
router.post(
  "/fetch-full",
  asyncHandler(async (req: Request, res: Response) => {
    const { mediaField } = req.body;

    if (!mediaField?.path) {
      res.status(400).json({
        error: "Bad Request",
        message: "Valid media field with path is required",
        statusCode: 400,
      });
      return;
    }

    const fullData = await mediaService.fetchFullForField(mediaField);

    if (!fullData) {
      res.status(404).json({
        error: "Not Found",
        message: "Media not found or could not be fetched",
        statusCode: 404,
      });
      return;
    }

    const response: ApiResponse<typeof fullData> = {
      data: fullData,
      success: true,
      message: "Full resolution media fetched successfully",
    };

    res.json(response);
  })
);

export default router;
