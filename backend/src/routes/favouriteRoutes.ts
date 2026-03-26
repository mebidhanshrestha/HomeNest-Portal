import { Router } from "express";
import {
  addFavourite,
  listFavourites,
  removeFavourite,
} from "../controllers/favouriteController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/http.js";

export const favouriteRoutes = Router();

favouriteRoutes.get("/", requireAuth, asyncHandler(listFavourites));
favouriteRoutes.post("/", requireAuth, asyncHandler(addFavourite));
favouriteRoutes.delete("/:propertyId", requireAuth, asyncHandler(removeFavourite));
