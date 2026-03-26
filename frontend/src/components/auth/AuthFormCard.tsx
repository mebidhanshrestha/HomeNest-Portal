import { useState } from "react";
import {
  Alert,
  type AlertColor,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  Typography,
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
import { SectionCard } from "../ui/SectionCard";

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

  return (
    <SectionCard
      title={mode === "login" ? "Welcome back" : "Create your account"}
      description={
        mode === "login"
          ? "Sign in to review listings and manage your shortlist."
          : "Register once and start saving homes right away."
      }
      sx={{ width: "100%" }}
    >
      <Tabs
        value={mode}
        onChange={(_event, value: AuthMode) => {
          setShowPassword(false);
          onModeChange(value);
        }}
      >
        <Tab value="login" icon={<LoginOutlinedIcon />} iconPosition="start" label="Login" />
        <Tab
          value="register"
          icon={<PersonAddAltOutlinedIcon />}
          iconPosition="start"
          label="Register"
        />
      </Tabs>

      {alert ? <Alert severity={alert.severity}>{alert.message}</Alert> : null}

      <Stack
        component="form"
        spacing={2}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        {mode === "register" ? (
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
        ) : null}

        <AppTextField
          label="Email address"
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
          helperText={
            fieldErrors.password ??
            "Use at least 8 characters with uppercase, lowercase, and a number."
          }
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
                >
                  {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <AppButton
          type="submit"
          fullWidth
          startIcon={mode === "login" ? <LoginOutlinedIcon /> : <PersonAddAltOutlinedIcon />}
          disabled={isPending}
        >
          {isPending
            ? "Submitting..."
            : mode === "login"
              ? "Login to dashboard"
              : "Create account"}
        </AppButton>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {mode === "login"
          ? "New to HomeNest? Switch to Register to create your buyer account."
          : "Already have an account? Switch back to Login."}
      </Typography>
    </SectionCard>
  );
};
