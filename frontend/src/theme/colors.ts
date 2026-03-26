import type { ThemeMode } from "../stores/themeStore";

// Update these two values to reskin the app.
export const APP_BRAND_COLORS = {
  primary: "#943AD0",
  secondary: "#F0B94B",
};

const lightSurfaces = {
  background: "#F4F7FE",
  paper: "#FFFFFF",
  paperMuted: "#F3EFFE",
  border: "#D8DCEE",
  textPrimary: "#21242E",
  textSecondary: "#6D7285",
};

const darkSurfaces = {
  background: "#141422",
  paper: "#1D1C31",
  paperMuted: "#282742",
  border: "#3A385B",
  textPrimary: "#F5F2FF",
  textSecondary: "#B7B2D0",
};

export const getSurfaceTokens = (mode: ThemeMode) =>
  mode === "light" ? lightSurfaces : darkSurfaces;
