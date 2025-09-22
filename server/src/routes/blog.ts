import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, BlogPost, ContentItem } from "../types/index.js";
import dbService from "../services";

const router = Router();

// GET /api/blog - Get all published blog posts
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const posts = await dbService.getBlogPosts();

    const response: ApiResponse<ContentItem<BlogPost>[]> = {
      data: posts,
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

    const response: ApiResponse<ContentItem<BlogPost>[]> = {
      data: [post],
      success: true,
      message: "Blog post retrieved successfully",
    };

    res.json(response);
    return;
  })
);

export default router;
