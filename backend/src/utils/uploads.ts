import fs from "node:fs";
import path from "node:path";

const resolveUploadsDirectory = () => {
  if (process.env.VERCEL) {
    return path.join("/tmp", "uploads");
  }

  return path.resolve(process.cwd(), "uploads");
};

export const uploadsDirectory = resolveUploadsDirectory();

export const ensureUploadsDirectory = () => {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
};
