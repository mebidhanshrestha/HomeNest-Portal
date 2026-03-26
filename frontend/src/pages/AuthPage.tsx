import { useEffect, useState } from "react";
import type { AlertColor } from "@mui/material";
import { Box, Container, useTheme } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { normalizeAppError } from "../lib/api";
import { useAuthStore } from "../stores/authStore";
import { loginUser, registerUser } from "../services/authService";
import {
  AuthFormCard,
  type AuthField,
  type AuthMode,
} from "../components/auth/AuthFormCard";

type AuthFormValues = {
  name: string;
  email: string;
  password: string;
};

type AuthAlert = {
  severity: AlertColor;
  message: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateAuthForm = (
  mode: AuthMode,
  values: AuthFormValues,
): Partial<Record<AuthField, string>> => {
  const errors: Partial<Record<AuthField, string>> = {};

  if (mode === "register" && values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!emailPattern.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (mode === "login") {
    if (!values.password) {
      errors.password = "Password is required.";
    }

    return errors;
  }

  if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = "Password must include at least one uppercase letter.";
  } else if (!/[a-z]/.test(values.password)) {
    errors.password = "Password must include at least one lowercase letter.";
  } else if (!/[0-9]/.test(values.password)) {
    errors.password = "Password must include at least one number.";
  }

  return errors;
};

export const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [formAlert, setFormAlert] = useState<AuthAlert | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<AuthField, string>>>({});
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const setSession = useAuthStore((state) => state.setSession);
  const authNotice = useAuthStore((state) => state.authNotice);
  const clearAuthNotice = useAuthStore((state) => state.clearAuthNotice);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const locationState = location.state as { from?: string; message?: string } | null;
  const redirectTo = locationState?.from ?? "/dashboard";

  useEffect(() => {
    if (authNotice) {
      setFormAlert({ severity: "warning", message: authNotice });
      clearAuthNotice();
    }
  }, [authNotice, clearAuthNotice]);

  useEffect(() => {
    if (locationState?.message) {
      setFormAlert({ severity: "warning", message: locationState.message });
      navigate(location.pathname, {
        replace: true,
        state: locationState.from ? { from: locationState.from } : null,
      });
    }
  }, [location.pathname, locationState?.from, locationState?.message, navigate]);

  const authMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
      };

      if (mode === "register") {
        return registerUser(payload);
      }

      return loginUser({
        email: payload.email,
        password: payload.password,
      });
    },
    onSuccess: (data) => {
      setFieldErrors({});
      setFormAlert(null);
      setSession(data.token, data.user);
      navigate(redirectTo, { replace: true });
    },
    onError: (error) => {
      const details = normalizeAppError(
        error,
        mode === "login"
          ? "We could not sign you in. Please try again."
          : "We could not create your account. Please try again.",
      );

      setFieldErrors(
        Object.entries(details.fieldErrors).reduce<Partial<Record<AuthField, string>>>(
          (accumulator, [field, messages]) => {
            if (field === "name" || field === "email" || field === "password") {
              accumulator[field] = messages[0];
            }

            return accumulator;
          },
          {},
        ),
      );
      setFormAlert({ severity: "error", message: details.message });
    },
  });

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    setFieldErrors({});
    setFormAlert(null);
  };

  const handleFieldChange = (field: AuthField, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });

    setFormAlert((current) => (current?.severity === "error" ? null : current));
  };

  const handleSubmit = () => {
    const nextFieldErrors = validateAuthForm(mode, formValues);

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setFormAlert({
        severity: "error",
        message: "Please fix the highlighted fields and try again.",
      });
      return;
    }

    setFieldErrors({});
    setFormAlert(null);
    authMutation.mutate();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        position: "relative",
        background:
          theme.palette.mode === "dark"
            ? `radial-gradient(ellipse at top, ${theme.palette.primary.dark}15 0%, transparent 50%),
               radial-gradient(ellipse at bottom, ${theme.palette.secondary.dark}10 0%, transparent 50%),
               ${theme.palette.background.default}`
            : `radial-gradient(ellipse at top, ${theme.palette.primary.light}12 0%, transparent 50%),
               radial-gradient(ellipse at bottom, ${theme.palette.secondary.light}08 0%, transparent 50%),
               ${theme.palette.background.default}`,
      }}
    >
      <Container maxWidth="sm">
        <AuthFormCard
          mode={mode}
          formValues={formValues}
          alert={formAlert}
          fieldErrors={fieldErrors}
          isPending={authMutation.isPending}
          onModeChange={handleModeChange}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
        />
      </Container>
    </Box>
  );
};
