import { api } from "../lib/api";
import type { AuthResponse, User } from "../types";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const registerUser = async (payload: RegisterPayload) => {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
};

export const loginUser = async (payload: LoginPayload) => {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get<{ user: User }>("/auth/me");
  return data.user;
};
