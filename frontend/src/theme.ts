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
        contrastText: "#21242E",
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
      borderRadius: 6,
    },
    typography: {
      fontFamily: '"Montserrat", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      h2: {
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: "-0.025em",
      },
      h3: {
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
      },
      h4: {
        fontWeight: 600,
        letterSpacing: "-0.015em",
      },
      h5: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      subtitle2: {
        fontWeight: 500,
      },
      body1: {
        lineHeight: 1.6,
      },
      body2: {
        lineHeight: 1.5,
      },
      button: {
        fontWeight: 600,
        textTransform: "none",
      },
      overline: {
        fontWeight: 600,
        letterSpacing: "0.08em",
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
                ? `linear-gradient(180deg, ${alpha(APP_BRAND_COLORS.primary, 0.02)} 0%, transparent 50%)`
                : `linear-gradient(180deg, ${alpha(APP_BRAND_COLORS.primary, 0.04)} 0%, transparent 50%)`,
            color: surfaces.textPrimary,
            scrollbarColor: `${alpha(APP_BRAND_COLORS.primary, 0.3)} transparent`,
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
            backgroundColor: alpha(APP_BRAND_COLORS.primary, 0.15),
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
            minHeight: 44,
            borderRadius: 6,
            paddingInline: 18,
            fontWeight: 600,
            transition: "all 150ms ease",
          },
          containedPrimary: {
            background: APP_BRAND_COLORS.primary,
            "&:hover": {
              background: alpha(APP_BRAND_COLORS.primary, 0.9),
            },
          },
          containedSecondary: {
            background: APP_BRAND_COLORS.secondary,
            "&:hover": {
              background: alpha(APP_BRAND_COLORS.secondary, 0.9),
            },
          },
          outlined: {
            borderColor: surfaces.border,
            "&:hover": {
              borderColor: APP_BRAND_COLORS.primary,
              backgroundColor: alpha(APP_BRAND_COLORS.primary, 0.04),
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundImage: "none",
            border: `1px solid ${surfaces.border}`,
            boxShadow: "none",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            fontWeight: 500,
            height: 28,
          },
          sizeSmall: {
            height: 24,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            backgroundColor: alpha(surfaces.paper, mode === "light" ? 0.6 : 0.4),
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(APP_BRAND_COLORS.primary, 0.4),
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: APP_BRAND_COLORS.primary,
              borderWidth: 1.5,
            },
          },
          input: {
            "&:-webkit-autofill": {
              WebkitBoxShadow: `0 0 0 100px ${alpha(surfaces.paper, mode === "light" ? 0.98 : 0.92)} inset`,
              WebkitTextFillColor: surfaces.textPrimary,
              caretColor: surfaces.textPrimary,
              borderRadius: 6,
              transition: "background-color 9999s ease-out 0s",
            },
            "&:-webkit-autofill:hover": {
              WebkitBoxShadow: `0 0 0 100px ${alpha(surfaces.paper, mode === "light" ? 0.98 : 0.92)} inset`,
              WebkitTextFillColor: surfaces.textPrimary,
            },
            "&:-webkit-autofill:focus": {
              WebkitBoxShadow: `0 0 0 100px ${alpha(surfaces.paper, mode === "light" ? 0.98 : 0.92)} inset`,
              WebkitTextFillColor: surfaces.textPrimary,
            },
          },
          notchedOutline: {
            borderColor: surfaces.border,
            transition: "border-color 150ms ease",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          rounded: {
            borderRadius: 8,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 8,
            border: `1px solid ${surfaces.border}`,
            boxShadow:
              mode === "light"
                ? "0 4px 20px rgba(0, 0, 0, 0.08)"
                : "0 4px 20px rgba(0, 0, 0, 0.3)",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            transition: "background-color 150ms ease",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 40,
            minWidth: 100,
            borderRadius: 6,
            fontWeight: 600,
            fontSize: "0.875rem",
            color: surfaces.textSecondary,
            transition: "all 150ms ease",
            "&.Mui-selected": {
              color: APP_BRAND_COLORS.primary,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            padding: 4,
            borderRadius: 8,
            backgroundColor: alpha(surfaces.paper, mode === "light" ? 0.6 : 0.4),
          },
          indicator: {
            height: "calc(100% - 8px)",
            top: 4,
            bottom: 4,
            borderRadius: 4,
            backgroundColor: surfaces.paper,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
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
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
          standardWarning: {
            backgroundColor: alpha("#F0B94B", 0.12),
            color: mode === "light" ? "#92400E" : "#FCD34D",
          },
          standardError: {
            backgroundColor: alpha("#EF4444", 0.12),
            color: mode === "light" ? "#991B1B" : "#FCA5A5",
          },
          standardSuccess: {
            backgroundColor: alpha("#10B981", 0.12),
            color: mode === "light" ? "#065F46" : "#6EE7B7",
          },
          standardInfo: {
            backgroundColor: alpha(APP_BRAND_COLORS.primary, 0.1),
            color: mode === "light" ? APP_BRAND_COLORS.primary : "#C4B5FD",
          },
        },
      },
    },
  });
};
