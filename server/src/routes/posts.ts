import { Router, Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { ApiResponse, ContentItem } from "../types/index.js";
import dbService from "../services/index.js";
import { mediaService } from "../services/index.js";
import {
  getCategoryById,
  getEnabledCategories,
  shouldShowCategory,
} from "../config/categories.js";

const router = Router();

/**
 * GET /api/posts - Get all categories with counts
 */
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const enabledCategories = getEnabledCategories();

    const categoriesWithCounts = await Promise.all(
      enabledCategories.map(async (category) => {
        const items = await dbService.getBySchemaId(category.id);
        const shouldShow = shouldShowCategory(category, items.length);

        return {
          ...category,
          count: items.length,
          visible: shouldShow,
        };
      })
    );

    const response: ApiResponse<typeof categoriesWithCounts> = {
      data: categoriesWithCounts,
      success: true,
      message: "Categories retrieved successfully",
    };

    res.json(response);
  })
);

/**
 * GET /api/posts/:category - Get all posts of a specific category
 * Supports both schemaId and apiPath formats
 */
router.get(
  "/:category",
  asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params;

    // Get category by ID (schemaId)
    const categoryConfig = getCategoryById(category);

    if (!categoryConfig) {
      res.status(404).json({
        error: "Not Found",
        message: `Category '${category}' not found`,
        statusCode: 404,
      });
      return;
    }

    if (!categoryConfig.enabled) {
      res.status(403).json({
        error: "Forbidden",
        message: `Category '${category}' is disabled`,
        statusCode: 403,
      });
      return;
    }

    // Fetch posts
    const posts = await dbService.getBySchemaId(category);

    // Process media if needed
    let processedPosts = posts;
    if (categoryConfig.hasMedia) {
      processedPosts = posts.map((post) =>
        mediaService.processContentFast(post)
      );
    }

    const response: ApiResponse<ContentItem<any>[]> = {
      data: processedPosts,
      success: true,
      message: `${categoryConfig.title} retrieved successfully`,
    };

    res.json(response);
  })
);

/**
 * GET /api/posts/:category/:id - Get a specific post by ID
 */
router.get(
  "/:category/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { category, id } = req.params;

    // Get category by ID (schemaId)
    const categoryConfig = getCategoryById(category);

    if (!categoryConfig) {
      res.status(404).json({
        error: "Not Found",
        message: `Category '${category}' not found`,
        statusCode: 404,
      });
      return;
    }

    if (!categoryConfig.enabled) {
      res.status(403).json({
        error: "Forbidden",
        message: `Category '${category}' is disabled`,
        statusCode: 403,
      });
      return;
    }

    // Fetch post
    const post = await dbService.getByIdAndSchemaId(category, id);

    if (!post) {
      res.status(404).json({
        error: "Not Found",
        message: `Post with id '${id}' not found in category '${category}'`,
        statusCode: 404,
      });
      return;
    }

    // Process media if needed (fast version)
    let processedPost = post;
    if (categoryConfig.hasMedia) {
      processedPost = mediaService.processContentFast(post);
    }

    const response: ApiResponse<ContentItem<any>[]> = {
      data: [processedPost],
      success: true,
      message: `Post retrieved successfully`,
    };

    res.json(response);
  })
);

/**
 * GET /api/posts/:category/:id/full - Get post with full resolution media
 */
router.get(
  "/:category/:id/full",
  asyncHandler(async (req: Request, res: Response) => {
    const { category, id } = req.params;

    // Get category by ID (schemaId)
    const categoryConfig = getCategoryById(category);

    if (!categoryConfig) {
      res.status(404).json({
        error: "Not Found",
        message: `Category '${category}' not found`,
        statusCode: 404,
      });
      return;
    }

    if (!categoryConfig.enabled) {
      res.status(403).json({
        error: "Forbidden",
        message: `Category '${category}' is disabled`,
        statusCode: 403,
      });
      return;
    }

    // Fetch post
    const post = await dbService.getByIdAndSchemaId(category, id);

    if (!post) {
      res.status(404).json({
        error: "Not Found",
        message: `Post with id '${id}' not found in category '${category}'`,
        statusCode: 404,
      });
      return;
    }

    // Process media if needed (full resolution)
    let processedPost = post;
    if (categoryConfig.hasMedia) {
      processedPost = await mediaService.processContentFull(post);
    }

    const response: ApiResponse<ContentItem<any>[]> = {
      data: [processedPost],
      success: true,
      message: `Post with full media retrieved successfully`,
    };

    res.json(response);
  })
);

export default router;
