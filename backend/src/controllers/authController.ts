import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { AppError } from "../utils/http.js";
import { signToken } from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { loginSchema, registerSchema } from "../utils/validation.js";

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
