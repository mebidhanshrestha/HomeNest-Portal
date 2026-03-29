import crypto from "node:crypto";
import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { AppError } from "../utils/http.js";
import { signToken } from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../utils/validation.js";

type UserRow = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    role: true;
    passwordHash: true;
  };
}>;

const formatAuthResponse = (user: Omit<UserRow, "passwordHash">) => ({
  token: signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  }),
  user,
});

export const register = async (request: Request, response: Response) => {
  const values = registerSchema.parse(request.body);

  const existingUser = await prisma.user.findUnique({
    where: { email: values.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError("An account with that email already exists.", 409);
  }

  const passwordHash = await hashPassword(values.password);
  const user = await prisma.user.create({
    data: {
      name: values.name,
      email: values.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  response.status(201).json(formatAuthResponse(user));
};

export const login = async (request: Request, response: Response) => {
  const values = loginSchema.parse(request.body);
  const user = await prisma.user.findUnique({
    where: { email: values.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isValidPassword = await verifyPassword(user.passwordHash, values.password);

  if (!isValidPassword) {
    throw new AppError("Invalid email or password.", 401);
  }

  const { passwordHash: _passwordHash, ...safeUser } = user;
  response.json(formatAuthResponse(safeUser));
};

export const me = async (request: Request, response: Response) => {
  const userId = request.user?.sub;

  if (!userId) {
    throw new AppError("Authentication required.", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  response.json({ user });
};

export const changePassword = async (request: Request, response: Response) => {
  const userId = request.user?.sub;

  if (!userId) {
    throw new AppError("Authentication required.", 401);
  }

  const values = changePasswordSchema.parse(request.body);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const isValidPassword = await verifyPassword(user.passwordHash, values.currentPassword);

  if (!isValidPassword) {
    throw new AppError("Current password is incorrect.", 400);
  }

  if (values.currentPassword === values.newPassword) {
    throw new AppError("New password must be different from the current password.", 400);
  }

  const passwordHash = await hashPassword(values.newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  response.json({ message: "Password updated successfully." });
};

export const forgotPassword = async (request: Request, response: Response) => {
  const values = forgotPasswordSchema.parse(request.body);
  const user = await prisma.user.findUnique({
    where: { email: values.email },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    response.json({
      message: "If an account with that email exists, you can now reset its password.",
    });
    return;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  const resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetTokenHash,
      resetPasswordExpiresAt,
    },
  });

  response.json({
    message: "Reset token generated. Continue to set a new password.",
    resetToken,
  });
};

export const resetPassword = async (request: Request, response: Response) => {
  const values = resetPasswordSchema.parse(request.body);
  const resetTokenHash = crypto.createHash("sha256").update(values.token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: resetTokenHash,
      resetPasswordExpiresAt: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError("Reset link is invalid or has expired.", 400);
  }

  const passwordHash = await hashPassword(values.newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
    },
  });

  response.json({ message: "Password reset successfully. Please sign in." });
};
