import { Router, Request, Response } from "express";
import { mockService } from "../services/mockService.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, BlogPost } from "../types/index.js";

const router = Router();

// GET /api/blog - Get all published blog posts
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const posts = await mockService.getBlogPosts();

    const response: ApiResponse<BlogPost[]> = {
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
    const post = await mockService.getBlogPostById(id);

    if (!post) {
      res.status(404).json({
        error: "Not Found",
        message: "Blog post not found",
        statusCode: 404,
      });
      return;
    }

    const response: ApiResponse<BlogPost> = {
      data: post,
      success: true,
      message: "Blog post retrieved successfully",
    };

    res.json(response);
    return;
  })
);

// POST /api/blog - Create new blog post
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const postData = req.body;
    const post = await mockService.createBlogPost(postData);

    const response: ApiResponse<BlogPost> = {
      data: post,
      success: true,
      message: "Blog post created successfully",
    };

    res.status(201).json(response);
  })
);

export default router;
