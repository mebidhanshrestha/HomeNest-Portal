import { useEffect, useState } from "react";
import type { AlertColor } from "@mui/material";
import { Box, Container, useTheme } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { normalizeAppError } from "../lib/api";
import { loginUser, registerUser } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import {
  AuthFormCard,
  type AuthFormValues,
  type AuthMode,
} from "../components/auth/AuthFormCard";

type AuthAlert = {
  severity: AlertColor;
  message: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [formAlert, setFormAlert] = useState<AuthAlert | null>(null);
  const setSession = useAuthStore((state) => state.setSession);
  const authNotice = useAuthStore((state) => state.authNotice);
  const clearAuthNotice = useAuthStore((state) => state.clearAuthNotice);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const locationState = location.state as { from?: string; message?: string } | null;
  const redirectTo = locationState?.from ?? "/dashboard";
  const {
    clearErrors,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<AuthFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUnregister: true,
  });

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
    mutationFn: async (payload: AuthFormValues) => {
      if (mode === "register") {
        return registerUser(payload);
      }

      return loginUser({
        email: payload.email,
        password: payload.password,
      });
    },
    onSuccess: (data) => {
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

      Object.entries(details.fieldErrors).forEach(([field, messages]) => {
        const message = messages[0];

        if ((field === "name" || field === "email" || field === "password") && message) {
          setError(field, {
            type: "server",
            message,
          });
        }
      });

      setFormAlert({ severity: "error", message: details.message });
    },
  });

  const authRegister = {
    name: register("name", {
      onChange: () => {
        clearErrors("name");
        setFormAlert((current) => (current?.severity === "error" ? null : current));
      },
      validate: (value: string) => {
        if (mode !== "register") {
          return true;
        }

        return value.trim().length >= 2 || "Name must be at least 2 characters.";
      },
    }),
    email: register("email", {
      onChange: () => {
        clearErrors("email");
        setFormAlert((current) => (current?.severity === "error" ? null : current));
      },
      validate: (value: string) =>
        emailPattern.test(value.trim()) || "Enter a valid email address.",
    }),
    password: register("password", {
      onChange: () => {
        clearErrors("password");
        setFormAlert((current) => (current?.severity === "error" ? null : current));
      },
      validate: (value: string) => {
        if (mode === "login") {
          return value ? true : "Password is required.";
        }

        if (value.length < 8) {
          return "Password must be at least 8 characters.";
        }

        if (!/[A-Z]/.test(value)) {
          return "Password must include at least one uppercase letter.";
        }

        if (!/[a-z]/.test(value)) {
          return "Password must include at least one lowercase letter.";
        }

        if (!/[0-9]/.test(value)) {
          return "Password must include at least one number.";
        }

        return true;
      },
    }),
  };

  const handleModeChange = (nextMode: AuthMode) => {
    const currentValues = getValues();

    setMode(nextMode);
    clearErrors();
    setFormAlert(null);
    reset(currentValues);
  };

  const onSubmit = handleSubmit(
    (values) => {
      clearErrors();
      setFormAlert(null);

      authMutation.mutate({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
    },
    () => {
      setFormAlert({
        severity: "error",
        message: "Please fix the highlighted fields and try again.",
      });
    },
  );

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
          alert={formAlert}
          fieldErrors={errors}
          isPending={authMutation.isPending}
          formFields={authRegister}
          onModeChange={handleModeChange}
          onForgotPassword={() => navigate("/auth/forgot")}
          onSubmit={onSubmit}
        />
      </Container>
    </Box>
  );
};
