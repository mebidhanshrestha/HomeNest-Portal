import { useEffect, useState } from "react";
import { Alert, Box, Container, Paper, Stack, Typography, useTheme } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AppButton } from "../components/ui/AppButton";
import { AppTextField } from "../components/ui/AppTextField";
import { normalizeAppError } from "../lib/api";
import { resetPassword } from "../services/authService";

type ResetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

export const ResetPasswordPage = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const token = searchParams.get("token") ?? "";
  const locationState = location.state as { message?: string } | null;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (!token) {
      navigate("/auth/forgot", {
        replace: true,
        state: { message: "Start the reset process again to get a valid reset link." },
      });
    }
  }, [navigate, token]);

  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (message) => {
      setSuccessMessage(message);
      window.setTimeout(() => {
        navigate("/auth", {
          replace: true,
          state: { message },
        });
      }, 1200);
    },
  });

  const error = resetMutation.isError
    ? normalizeAppError(resetMutation.error, "We could not reset your password.")
    : null;

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
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: 5, borderRadius: 2, border: 1, borderColor: "divider" }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Reset password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Choose a new password for your account.
              </Typography>
            </Box>

            {locationState?.message ? <Alert severity="info">{locationState.message}</Alert> : null}
            {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
            {error ? <Alert severity="error">{error.message}</Alert> : null}

            <Stack
              component="form"
              spacing={2}
              onSubmit={handleSubmit((values) => {
                setSuccessMessage(null);
                resetMutation.mutate({
                  token,
                  newPassword: values.newPassword,
                  confirmPassword: values.confirmPassword,
                });
              })}
            >
              <AppTextField
                label="New password"
                type="password"
                error={Boolean(errors.newPassword)}
                helperText={errors.newPassword?.message}
                InputProps={{
                  startAdornment: <LockOutlinedIcon fontSize="small" color="action" />,
                }}
                {...register("newPassword", {
                  validate: (value) => {
                    if (value.length < 8) return "New password must be at least 8 characters.";
                    if (!/[A-Z]/.test(value)) return "New password must include at least one uppercase letter.";
                    if (!/[a-z]/.test(value)) return "New password must include at least one lowercase letter.";
                    if (!/[0-9]/.test(value)) return "New password must include at least one number.";
                    return true;
                  },
                })}
              />
              <AppTextField
                label="Confirm new password"
                type="password"
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: <LockOutlinedIcon fontSize="small" color="action" />,
                }}
                {...register("confirmPassword", {
                  validate: (value, formValues) =>
                    value === formValues.newPassword || "New passwords do not match.",
                })}
              />
              <AppButton type="submit" disabled={resetMutation.isPending || !token}>
                {resetMutation.isPending ? "Please wait..." : "Reset password"}
              </AppButton>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};
