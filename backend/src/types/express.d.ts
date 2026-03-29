import type { UploadedFile } from "express-fileupload";
import type { JwtPayload } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      file?: UploadedFile;
    }
  }
}

export {};
