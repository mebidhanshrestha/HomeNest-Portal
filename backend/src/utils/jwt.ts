import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config.js";

export type JwtPayload = {
  sub: number;
  email: string;
  role: string;
  name: string;
};

const signOptions: SignOptions = {
  expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
};

export const signToken = (payload: JwtPayload) => jwt.sign(payload, env.jwtSecret, signOptions);

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, env.jwtSecret);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload.");
  }

  return decoded as unknown as JwtPayload;
};
