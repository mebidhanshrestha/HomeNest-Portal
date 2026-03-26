import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

type AuthState = {
  token: string | null;
  user: User | null;
  authNotice: string | null;
  setSession: (token: string, user: User) => void;
  setAuthNotice: (message: string | null) => void;
  clearAuthNotice: () => void;
  clearSession: (notice?: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      authNotice: null,
      setSession: (token, user) => set({ token, user, authNotice: null }),
      setAuthNotice: (authNotice) => set({ authNotice }),
      clearAuthNotice: () => set({ authNotice: null }),
      clearSession: (notice) => set({ token: null, user: null, authNotice: notice ?? null }),
    }),
    {
      name: "homenest-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
