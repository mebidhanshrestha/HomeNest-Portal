import { Router } from "express";
import { listProperties } from "../controllers/propertyController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/http.js";

export const propertyRoutes = Router();

propertyRoutes.get("/", requireAuth, asyncHandler(listProperties));
