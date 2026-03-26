import { alpha, createTheme } from "@mui/material/styles";
import type { ThemeMode } from "./stores/themeStore";
import { APP_BRAND_COLORS, getSurfaceTokens } from "./theme/colors";

export const createAppTheme = (mode: ThemeMode) => {
  const surfaces = getSurfaceTokens(mode);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: APP_BRAND_COLORS.primary,
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: APP_BRAND_COLORS.secondary,
        contrastText: "#FFFFFF",
      },
      background: {
        default: surfaces.background,
        paper: surfaces.paper,
      },
      text: {
        primary: surfaces.textPrimary,
        secondary: surfaces.textSecondary,
      },
      divider: surfaces.border,
    },
    shape: {
      borderRadius: 20,
    },
    typography: {
      fontFamily: '"Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif',
      h2: {
        fontWeight: 700,
        lineHeight: 1.08,
      },
      h3: {
        fontWeight: 700,
        lineHeight: 1.1,
      },
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 700,
      },
      button: {
        fontWeight: 700,
        textTransform: "none",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ":root": {
            colorScheme: mode,
          },
          "html, body, #root": {
            minHeight: "100%",
          },
          body: {
            margin: 0,
            minWidth: 320,
            backgroundColor: surfaces.background,
            backgroundImage:
              mode === "light"
                ? `radial-gradient(circle at top left, ${alpha(
                    APP_BRAND_COLORS.primary,
                    0.12,
                  )}, transparent 30%), radial-gradient(circle at top right, ${alpha(
                    APP_BRAND_COLORS.secondary,
                    0.14,
                  )}, transparent 24%)`
                : `radial-gradient(circle at top left, ${alpha(
                    APP_BRAND_COLORS.primary,
                    0.18,
                  )}, transparent 28%), radial-gradient(circle at top right, ${alpha(
                    APP_BRAND_COLORS.secondary,
                    0.12,
                  )}, transparent 22%)`,
            color: surfaces.textPrimary,
          },
          a: {
            color: "inherit",
            textDecoration: "none",
          },
          img: {
            display: "block",
            maxWidth: "100%",
          },
          "::selection": {
            backgroundColor: alpha(APP_BRAND_COLORS.primary, 0.18),
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            minHeight: 48,
            borderRadius: 16,
            paddingInline: 20,
          },
          outlined: {
            borderColor: surfaces.border,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 28,
            backgroundImage: "none",
            border: `1px solid ${surfaces.border}`,
            boxShadow:
              mode === "light"
                ? "0 20px 50px rgba(31, 42, 51, 0.08)"
                : "0 24px 56px rgba(4, 12, 20, 0.42)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 600,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: alpha(surfaces.paperMuted, mode === "light" ? 0.5 : 0.85),
          },
          notchedOutline: {
            borderColor: surfaces.border,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 24,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 44,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 3,
            borderRadius: 999,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: surfaces.border,
          },
        },
      },
    },
  });
};
