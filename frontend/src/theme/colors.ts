import type { ThemeMode } from "../stores/themeStore";

// Update these two values to reskin the app.
export const APP_BRAND_COLORS = {
  primary: "#2F5D73",
  secondary: "#D88462",
};

const lightSurfaces = {
  background: "#F4F6F2",
  paper: "#FFFFFF",
  paperMuted: "#EEF2EC",
  border: "#D7E0D8",
  textPrimary: "#1F2A33",
  textSecondary: "#5E6C76",
};

const darkSurfaces = {
  background: "#162029",
  paper: "#1D2A35",
  paperMuted: "#243340",
  border: "#314350",
  textPrimary: "#F4F7F8",
  textSecondary: "#B9C5CB",
};

export const getSurfaceTokens = (mode: ThemeMode) =>
  mode === "light" ? lightSurfaces : darkSurfaces;
