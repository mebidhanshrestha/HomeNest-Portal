import cors from "cors";
import express from "express";
import { authRoutes } from "./routes/authRoutes.js";
import { favouriteRoutes } from "./routes/favouriteRoutes.js";
import { propertyRoutes } from "./routes/propertyRoutes.js";
import { env } from "./config.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favourites", favouriteRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
