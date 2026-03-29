import { v2 as cloudinary } from "cloudinary";
import type { UploadedFile } from "express-fileupload";
import { env } from "../config.js";

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

export const uploadPropertyImage = async (file: UploadedFile) =>
  cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.data.toString("base64")}`, {
    folder: env.cloudinaryFolder,
    resource_type: "image",
  });

export const deleteCloudinaryImage = async (publicId: string) => {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Failed to delete Cloudinary image: ${result.result}`);
  }
};

const cloudinaryHostPattern = /(^|\.)res\.cloudinary\.com$/i;

export const getCloudinaryPublicIdFromUrl = (imageUrl: string) => {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return null;
  }

  if (!cloudinaryHostPattern.test(parsedUrl.hostname)) {
    return null;
  }

  const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
  const uploadIndex = pathSegments.findIndex((segment) => segment === "upload");

  if (uploadIndex === -1) {
    return null;
  }

  const assetSegments = pathSegments.slice(uploadIndex + 1);

  if (assetSegments.length === 0) {
    return null;
  }

  if (/^v\d+$/.test(assetSegments[0])) {
    assetSegments.shift();
  }

  if (assetSegments.length === 0) {
    return null;
  }

  const lastSegment = assetSegments[assetSegments.length - 1];
  const extensionIndex = lastSegment.lastIndexOf(".");

  if (extensionIndex > 0) {
    assetSegments[assetSegments.length - 1] = lastSegment.slice(0, extensionIndex);
  }

  return assetSegments.join("/");
};
