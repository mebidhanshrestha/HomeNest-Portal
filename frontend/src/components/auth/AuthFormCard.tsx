import { useState } from "react";
import {
  Alert,
  type AlertColor,
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { AppButton } from "../ui/AppButton";
import { AppTextField } from "../ui/AppTextField";
import homeNestLogo from "../../assets/images/home-nest.png";

export type AuthMode = "login" | "register";
export type AuthField = "name" | "email" | "password";

type AuthFormCardProps = {
  mode: AuthMode;
  formValues: {
    name: string;
    email: string;
    password: string;
  };
  alert: {
    severity: AlertColor;
    message: string;
  } | null;
  fieldErrors: Partial<Record<AuthField, string>>;
  isPending: boolean;
  onModeChange: (mode: AuthMode) => void;
  onFieldChange: (field: AuthField, value: string) => void;
  onSubmit: () => void;
};

export const AuthFormCard = ({
  mode,
  formValues,
  alert,
  fieldErrors,
  isPending,
  onModeChange,
  onFieldChange,
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

          {alert && (
            <Alert severity={alert.severity} sx={{ mt: 2 }}>
              {alert.message}
            </Alert>
          )}

          <Stack
            component="form"
            spacing={2}
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            {mode === "register" && (
              <AppTextField
                label="Full name"
                value={formValues.name}
                onChange={(event) => onFieldChange("name", event.target.value)}
                error={Boolean(fieldErrors.name)}
                helperText={fieldErrors.name}
                required
                autoComplete="name"
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
              value={formValues.email}
              onChange={(event) => onFieldChange("email", event.target.value)}
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email}
              required
              autoComplete="email"
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
              value={formValues.password}
              onChange={(event) => onFieldChange("password", event.target.value)}
              error={Boolean(fieldErrors.password)}
              helperText={fieldErrors.password}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
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
