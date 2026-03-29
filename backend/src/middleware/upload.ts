import path from "node:path";
import multer from "multer";
import { AppError } from "../utils/http.js";
import { ensureUploadsDirectory, uploadsDirectory } from "../utils/uploads.js";

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    ensureUploadsDirectory();
    callback(null, uploadsDirectory);
  },
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50);

    callback(null, `${Date.now()}-${baseName || "property"}${extension}`);
  },
});

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const propertyImageUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new AppError("Upload a JPG, PNG, or WebP image.", 400));
      return;
    }

    callback(null, true);
  },
});
