import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { AppError } from "../utils/http.js";

export const notFoundHandler = (_request: Request, _response: Response, next: NextFunction) => {
  next(new AppError("Route not found.", 404));
};

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: "Validation failed.",
      errors: error.flatten().fieldErrors,
    });
    return;
  }

  if (error instanceof multer.MulterError) {
    response.status(400).json({ message: "Image upload failed. Check the file size and try again." });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  response.status(500).json({ message: "Internal server error." });
};
