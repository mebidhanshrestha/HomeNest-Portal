import { Router } from "express";
import {
  createProperty,
  deleteProperty,
  getProperty,
  listPropertyCities,
  listProperties,
  updateProperty,
} from "../controllers/propertyController.js";
import { propertyImageUpload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/http.js";

export const propertyRoutes = Router();

propertyRoutes.get("/cities", requireAuth, asyncHandler(listPropertyCities));
propertyRoutes.get("/", requireAuth, asyncHandler(listProperties));
propertyRoutes.get("/:id", requireAuth, asyncHandler(getProperty));
propertyRoutes.post(
  "/",
  requireAuth,
  propertyImageUpload,
  asyncHandler(createProperty),
);
propertyRoutes.put("/:id", requireAuth, asyncHandler(updateProperty));
propertyRoutes.delete("/:id", requireAuth, asyncHandler(deleteProperty));
