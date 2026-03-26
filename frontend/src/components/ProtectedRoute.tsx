import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import type { PropsWithChildren } from "react";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const token = useAuthStore((state) => state.token);
  const authNotice = useAuthStore((state) => state.authNotice);
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{
          from: location.pathname,
          message: authNotice ?? "Please sign in to continue.",
        }}
      />
    );
  }

  return children;
};
