import type { NextFunction, Request, Response } from "express";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
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

  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof PrismaClientInitializationError) {
    response.status(503).json({ message: "Database connection failed." });
    return;
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P1001") {
      response.status(503).json({ message: "Database connection failed." });
      return;
    }

    if (error.code === "P2022") {
      response.status(500).json({ message: "Database schema is out of sync." });
      return;
    }
  }

  console.error(error);
  response.status(500).json({ message: "Internal server error." });
};
