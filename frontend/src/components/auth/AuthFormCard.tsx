import { useState, type FormEventHandler } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Typography,
  useTheme,
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

  return (
    <Stack sx={{ width: "100%", maxWidth: 420, gap: 0 }}>
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
              : "#ffffff",
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={2} alignItems="center">
            <Box
              component="img"
              src={homeNestLogo}
              alt="HomeNest"
              sx={{
                width: 200,
                height: "auto",
                objectFit: "contain",
              }}
            />
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" fontWeight={700}>
                {mode === "login" ? "Welcome back" : "Create account"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {mode === "login"
                  ? "Sign in to continue to HomeNest"
                  : "Get started with your free account"}
              </Typography>
            </Box>
          </Stack>

          <Stack component="form" spacing={2} onSubmit={onSubmit}>
            {mode === "register" && (
              <AppTextField
                label="Full name"
                error={Boolean(fieldErrors.name)}
                helperText={fieldErrors.name?.message}
                required
                autoComplete="name"
                {...formFields.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <AppTextField
              label="Email"
              type="email"
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email?.message}
              required
              autoComplete="email"
              {...formFields.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <AppTextField
              label="Password"
              type={showPassword ? "text" : "password"}
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password?.message}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              {...formFields.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
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

            <AppButton
              type="submit"
              fullWidth
              size="large"
              startIcon={mode === "login" ? <LoginOutlinedIcon /> : <PersonAddAltOutlinedIcon />}
              disabled={isPending}
              sx={{ mt: 2 }}
            >
              {isPending
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </AppButton>

            {mode === "login" ? (
              <Box sx={{ textAlign: "right" }}>
                <Box
                  component="button"
                  type="button"
                  onClick={onForgotPassword}
                  sx={{
                    border: 0,
                    p: 0,
                    background: "transparent",
                    color: "primary.main",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Forgot password?
                </Box>
              </Box>
            ) : null}
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 2.5,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          textAlign: "center",
          background: "transparent",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <Box
            component="span"
            onClick={() => {
              setShowPassword(false);
              onModeChange(mode === "login" ? "register" : "login");
            }}
            sx={{
              color: "primary.main",
              fontWeight: 600,
              cursor: "pointer",
              transition: "opacity 0.2s",
              "&:hover": { opacity: 0.8 },
            }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </Box>
        </Typography>
      </Paper>
    </Stack>
  );
};
