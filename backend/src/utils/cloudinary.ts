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
