import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/http.js";
import { verifyToken } from "../utils/jwt.js";

export const requireAuth = (request: Request, _response: Response, next: NextFunction) => {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError("Authentication required.", 401));
    return;
  }

  const token = authorization.slice("Bearer ".length);

  try {
    request.user = verifyToken(token);
    next();
  } catch {
    next(new AppError("Invalid or expired token.", 401));
  }
};
