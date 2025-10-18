import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, BlogPost, ContentItem } from "../types/index.js";
import dbService from "../services";
import { mediaService } from "../services";

const router = Router();

// GET /api/blog - Get all published blog posts
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const posts = await dbService.getBlogPosts();

    // Process media for each post (fast version with thumbnails)
    const processedPosts = posts.map((post) =>
      mediaService.processContentFast(post)
    );

    const response: ApiResponse<ContentItem<BlogPost>[]> = {
      data: processedPosts,
      success: true,
      message: "Blog posts retrieved successfully",
    };

    res.json(response);
  })
);

// GET /api/blog/:id - Get blog post by ID
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const post = await dbService.getBlogPostById(id);

    if (!post) {
      res.status(404).json({
        error: "Not Found",
        message: "Blog post not found",
        statusCode: 404,
      });
      return;
    }

    // Process media (fast version with thumbnails)
    const processedPost = mediaService.processContentFast(post);

    const response: ApiResponse<ContentItem<BlogPost>[]> = {
      data: [processedPost],
      success: true,
      message: "Blog post retrieved successfully",
    };

    res.json(response);
    return;
  })
);

// GET /api/blog/:id/full - Get blog post with full resolution media
router.get(
  "/:id/full",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const post = await dbService.getBlogPostById(id);

    if (!post) {
      res.status(404).json({
        error: "Not Found",
        message: "Blog post not found",
        statusCode: 404,
      });
      return;
    }

    // Process media (full resolution - async)
    const processedPost = await mediaService.processContentFull(post);

    const response: ApiResponse<ContentItem<BlogPost>[]> = {
      data: [processedPost],
      success: true,
      message: "Blog post with full media retrieved successfully",
    };

    res.json(response);
    return;
  })
);

export default router;
