import { useState, type FormEventHandler } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Typography,
  useTheme,
  alpha,
  Divider,
} from "@mui/material";
import type { FieldErrors, UseFormRegisterReturn } from "react-hook-form";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import homeNestLogo from "../../assets/images/home-nest.png";
import { AppButton } from "../ui/AppButton";
import { AppTextField } from "../ui/AppTextField";

export type AuthMode = "login" | "register";
export type AuthFormValues = {
  name: string;
  email: string;
  password: string;
};

type AuthFormCardProps = {
  mode: AuthMode;
  fieldErrors: FieldErrors<AuthFormValues>;
  isPending: boolean;
  formFields: {
    name: UseFormRegisterReturn<"name">;
    email: UseFormRegisterReturn<"email">;
    password: UseFormRegisterReturn<"password">;
  };
  onModeChange: (mode: AuthMode) => void;
  onForgotPassword: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const AuthFormCard = ({
  mode,
  fieldErrors,
  isPending,
  formFields,
  onModeChange,
  onForgotPassword,
  onSubmit,
}: AuthFormCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Stack sx={{ width: "100%", maxWidth: 520, px: 2 }}>
      <Paper
        elevation={isDark ? 0 : 4}
        sx={{
          borderRadius: 4, // More rounded for modern feel
          overflow: "hidden",
          border: "1px solid",
          borderColor: isDark
            ? alpha(theme.palette.divider, 0.1)
            : "transparent",
          background: isDark
            ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(
                theme.palette.background.default,
                0.9,
              )} 100%)`
            : "#ffffff",
          backdropFilter: "blur(10px)",
          boxShadow: isDark
            ? "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
            : "0 10px 40px -10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header Section */}
        <Stack spacing={4} sx={{ p: { xs: 4, sm: 6 } }}>
          <Stack spacing={3} alignItems="center">
            <Box
              component="img"
              src={homeNestLogo}
              alt="HomeNest"
              sx={{
                width: 160,
                height: "auto",
                filter: isDark ? "brightness(1.2)" : "none",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.02)" },
              }}
            />
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  letterSpacing: "-0.5px",
                  color: theme.palette.text.primary,
                }}
              >
                {mode === "login" ? "Welcome back" : "Join HomeNest"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                {mode === "login"
                  ? "Enter your credentials to access your account"
                  : "Start your journey with a few simple steps"}
              </Typography>
            </Box>
          </Stack>

          {/* Form Section */}
          <Stack component="form" spacing={2.5} onSubmit={onSubmit}>
            {mode === "register" && (
              <AppTextField
                label="Full name"
                placeholder="John Doe"
                error={Boolean(fieldErrors.name)}
                helperText={fieldErrors.name?.message}
                required
                {...formFields.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon
                        fontSize="small"
                        color="action"
                      />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <AppTextField
              label="Email address"
              type="email"
              placeholder="name@example.com"
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email?.message}
              required
              {...formFields.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineOutlinedIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <AppTextField
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password?.message}
                required
                {...formFields.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {mode === "login" && (
                <Box sx={{ mt: 1, textAlign: "right" }}>
                  <Typography
                    variant="caption"
                    onClick={onForgotPassword}
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Forgot password?
                  </Typography>
                </Box>
              )}
            </Box>

            <AppButton
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              startIcon={
                mode === "login" ? (
                  <LoginOutlinedIcon />
                ) : (
                  <PersonAddAltOutlinedIcon />
                )
              }
              disabled={isPending}
              sx={{
                py: 1.5,
                borderRadius: 2.5,
                fontSize: "1rem",
                textTransform: "none",
                fontWeight: 700,
                boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.39)}`,
              }}
            >
              {isPending
                ? "Authenticating..."
                : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
            </AppButton>
          </Stack>
        </Stack>

        {/* Footer Section */}
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: isDark
              ? alpha(theme.palette.common.white, 0.03)
              : alpha(theme.palette.primary.main, 0.03),
            borderTop: "1px solid",
            borderColor: theme.palette.divider,
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {mode === "login" ? "Don't have an account?" : "Already a member?"}{" "}
            <Typography
              component="span"
              variant="body2"
              onClick={() => {
                setShowPassword(false);
                onModeChange(mode === "login" ? "register" : "login");
              }}
              sx={{
                color: "primary.main",
                fontWeight: 700,
                cursor: "pointer",
                ml: 0.5,
                transition: "all 0.2s",
                "&:hover": { color: "primary.dark" },
              }}
            >
              {mode === "login" ? "Create one now" : "Sign in here"}
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
};
