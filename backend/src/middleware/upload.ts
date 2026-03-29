import fileUpload from "express-fileupload";
import type { RequestHandler } from "express";
import { AppError } from "../utils/http.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const parseUpload = fileUpload({
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  useTempFiles: false,
});

export const propertyImageUpload: RequestHandler[] = [
  parseUpload,
  (request, _response, next) => {
    const uploadedFile = request.files?.image;

    if (!uploadedFile || Array.isArray(uploadedFile)) {
      next(new AppError("Property image is required.", 400));
      return;
    }

    if (uploadedFile.truncated) {
      next(new AppError("Image upload failed. Check the file size and try again.", 400));
      return;
    }

    if (!allowedMimeTypes.has(uploadedFile.mimetype)) {
      next(new AppError("Upload a JPG, PNG, or WebP image.", 400));
      return;
    }

    request.file = uploadedFile;
    next();
  },
];
