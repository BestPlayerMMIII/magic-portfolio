import { Request, Response, NextFunction } from "express";
import { ApiError } from "../types/index.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  // Default error response
  const error: ApiError = {
    error: "Internal Server Error",
    message: "Something went wrong",
    statusCode: 500,
  };

  // Handle specific error types
  if (err.name === "ValidationError") {
    error.statusCode = 400;
    error.error = "Validation Error";
    error.message = err.message;
  } else if (err.name === "UnauthorizedError") {
    error.statusCode = 401;
    error.error = "Unauthorized";
    error.message = "Access denied";
  } else if (err.name === "NotFoundError") {
    error.statusCode = 404;
    error.error = "Not Found";
    error.message = err.message;
  }

  // In development, include the stack trace
  if (process.env.NODE_ENV === "development") {
    (error as any).stack = err.stack;
  }

  res.status(error.statusCode).json(error);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
