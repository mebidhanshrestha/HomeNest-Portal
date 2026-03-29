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

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
  confirmPassword: string;
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

export const changePassword = async (payload: ChangePasswordPayload) => {
  const { data } = await api.post<{ message: string }>("/auth/change-password", payload);
  return data.message;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const { data } = await api.post<{ message: string; resetToken?: string }>("/auth/forgot-password", payload);
  return data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await api.post<{ message: string }>("/auth/reset-password", payload);
  return data.message;
};
