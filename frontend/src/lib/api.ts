import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export type AppErrorDetails = {
  title: string;
  message: string;
  statusCode?: number;
  fieldErrors: Record<string, string[]>;
  isNetworkError: boolean;
  isAuthError: boolean;
  isServerError: boolean;
};

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const { token, clearSession } = useAuthStore.getState();

      if (token) {
        const details = normalizeAppError(error, "Your session expired. Please sign in again.");
        const authMessage =
          details.message === "Invalid or expired token."
            ? "Your session expired. Please sign in again."
            : details.message;

        clearSession(authMessage);
      }
    }

    return Promise.reject(error);
  },
);

const getErrorTitle = (statusCode?: number, isNetworkError = false) => {
  if (isNetworkError) {
    return "Network error";
  }

  if (statusCode === 400) {
    return "Invalid request";
  }

  if (statusCode === 401) {
    return "Authentication error";
  }

  if (statusCode === 403) {
    return "Access denied";
  }

  if (statusCode === 404) {
    return "Not found";
  }

  if (statusCode === 409) {
    return "Conflict";
  }

  if (statusCode && statusCode >= 500) {
    return "Server error";
  }

  return "Something went wrong";
};

const normalizeFieldErrors = (errors?: ApiErrorResponse["errors"]) => {
  if (!errors) {
    return {};
  }

  return Object.entries(errors).reduce<Record<string, string[]>>((accumulator, [field, messages]) => {
    if (Array.isArray(messages) && messages.length > 0) {
      accumulator[field] = messages.filter(Boolean) as string[];
    }

    return accumulator;
  }, {});
};

export const normalizeAppError = (
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again.",
): AppErrorDetails => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    const responseData = error.response?.data as ApiErrorResponse | undefined;
    const isNetworkError = !error.response;

    return {
      title: getErrorTitle(statusCode, isNetworkError),
      message:
        responseData?.message ??
        (isNetworkError
          ? "We could not reach the server. Check your connection and try again."
          : fallbackMessage),
      statusCode,
      fieldErrors: normalizeFieldErrors(responseData?.errors),
      isNetworkError,
      isAuthError: statusCode === 401,
      isServerError: Boolean(statusCode && statusCode >= 500),
    };
  }

  if (error instanceof Error) {
    return {
      title: "Unexpected error",
      message: error.message || fallbackMessage,
      fieldErrors: {},
      isNetworkError: false,
      isAuthError: false,
      isServerError: false,
    };
  }

  return {
    title: "Unexpected error",
    message: fallbackMessage,
    fieldErrors: {},
    isNetworkError: false,
    isAuthError: false,
    isServerError: false,
  };
};

export const getApiErrorMessage = (error: unknown) => {
  return normalizeAppError(error).message;
};
