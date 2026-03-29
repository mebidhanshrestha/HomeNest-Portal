import { useState } from "react";
import { Box, Container, Paper, Stack, Typography, useTheme } from "@mui/material";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppButton } from "../components/ui/AppButton";
import { AppTextField } from "../components/ui/AppTextField";
import { normalizeAppError } from "../lib/api";
import { forgotPassword } from "../services/authService";
import { useToastStore } from "../stores/toastStore";

type ForgotPasswordFormValues = {
  email: string;
};

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const showToast = useToastStore((state) => state.showToast);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const forgotMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      showToast(data.message, "info");

      if (data.resetToken) {
        navigate(`/auth/reset?token=${encodeURIComponent(data.resetToken)}`, {
          replace: true,
          state: { message: data.message },
        });
      }
    },
    onError: (error) => {
      const details = normalizeAppError(error, "We could not start the password reset flow.");
      showToast(details.message, "error");
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background:
          theme.palette.mode === "dark"
            ? `radial-gradient(ellipse at top, ${theme.palette.primary.dark}15 0%, transparent 50%), ${theme.palette.background.default}`
            : `radial-gradient(ellipse at top, ${theme.palette.primary.light}12 0%, transparent 50%), ${theme.palette.background.default}`,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: 5, borderRadius: 2, border: 1, borderColor: "divider" }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Forgot password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Enter your email to start resetting your password.
              </Typography>
            </Box>
            <Stack
              component="form"
              spacing={2}
              onSubmit={handleSubmit((values) => {
                forgotMutation.mutate({ email: values.email.trim() });
              })}
            >
              <AppTextField
                label="Email"
                type="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: <MailOutlineOutlinedIcon fontSize="small" color="action" />,
                }}
                {...register("email", {
                  validate: (value) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Enter a valid email address.",
                })}
              />
              <AppButton type="submit" disabled={forgotMutation.isPending}>
                {forgotMutation.isPending ? "Please wait..." : "Continue"}
              </AppButton>
              <AppButton variant="outlined" onClick={() => navigate("/auth")}>
                Back to sign in
              </AppButton>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};
