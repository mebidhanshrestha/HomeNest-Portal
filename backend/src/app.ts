import cors from "cors";
import express from "express";
import path from "node:path";
import { authRoutes } from "./routes/authRoutes.js";
import { favouriteRoutes } from "./routes/favouriteRoutes.js";
import { propertyRoutes } from "./routes/propertyRoutes.js";
import { env } from "./config.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const allowedOrigins = new Set(
        env.clientOrigins.flatMap((allowedOrigin) => {
          const url = new URL(allowedOrigin);
          const variants = [allowedOrigin];

          if (url.hostname === "localhost") {
            variants.push(`${url.protocol}//127.0.0.1:${url.port}`);
          }

          if (url.hostname === "127.0.0.1") {
            variants.push(`${url.protocol}//localhost:${url.port}`);
          }

          return variants;
        }),
      );

      callback(null, allowedOrigins.has(origin));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    status: "ok",
    service: "HomeNest Portal Backend",
    health: "/api/health",
  });
});

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favourites", favouriteRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
