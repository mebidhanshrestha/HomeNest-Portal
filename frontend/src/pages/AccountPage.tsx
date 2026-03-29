import { useState } from "react";
import { Alert, Avatar, Box, CircularProgress, Stack, Typography } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { changePassword } from "../services/authService";
import { AppButton } from "../components/ui/AppButton";
import { AppTextField } from "../components/ui/AppTextField";
import { ErrorState } from "../components/ui/ErrorState";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { normalizeAppError } from "../lib/api";
import { usePortalData } from "../hooks/usePortalData";
import { useAuthStore } from "../stores/authStore";

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const AccountPage = () => {
  const [feedback, setFeedback] = useState<{ severity: "success" | "error"; message: string } | null>(null);
  const clearSession = useAuthStore((state) => state.clearSession);
  const {
    user,
    userQuery,
    blockingUserError,
    userError,
  } = usePortalData();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (message) => {
      setFeedback({ severity: "success", message });
      reset();
    },
    onError: (error) => {
      const details = normalizeAppError(error, "We could not update your password.");
      setFeedback({ severity: "error", message: details.message });
    },
  });

  if (userQuery.isLoading && !user) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (blockingUserError) {
    return (
      <SectionCard>
        <ErrorState
          title={blockingUserError.title}
          description={blockingUserError.message}
          action={
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <AppButton startIcon={<RefreshOutlinedIcon />} onClick={() => userQuery.refetch()}>
                Retry
              </AppButton>
              <AppButton variant="outlined" onClick={() => clearSession()}>
                Sign out
              </AppButton>
            </Stack>
          }
        />
      </SectionCard>
    );
  }

  return (
    <Stack spacing={4}>
      <PageHeader
        eyebrow="Account"
        title="Account"
        subtitle="Review your account details and update your password."
      />

      {userError ? (
        <Alert severity="warning" onClose={() => userQuery.refetch()}>
          {userError.message} Showing the last available profile details.
        </Alert>
      ) : null}

      {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

      <SectionCard title="Account details" description="Your current account information.">
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ sm: "center" }}>
          <Avatar
            sx={{
              width: 84,
              height: 84,
              bgcolor: "secondary.main",
              color: "secondary.contrastText",
              fontSize: 32,
            }}
          >
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </Avatar>
          <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonOutlineOutlinedIcon fontSize="small" color="action" />
              <Typography>{user?.name ?? "Buyer"}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailOutlinedIcon fontSize="small" color="action" />
              <Typography color="text.secondary">{user?.email ?? "Not available"}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </SectionCard>

      <SectionCard title="Change password" description="Update your password for this account.">
        <Stack
          component="form"
          spacing={2}
          onSubmit={handleSubmit((values) => {
            setFeedback(null);
            changePasswordMutation.mutate(values);
          })}
        >
          <AppTextField
            label="Current password"
            type="password"
            error={Boolean(errors.currentPassword)}
            helperText={errors.currentPassword?.message}
            InputProps={{
              startAdornment: <LockOutlinedIcon fontSize="small" color="action" />,
            }}
            {...register("currentPassword", {
              required: "Current password is required.",
            })}
          />
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
          <AppButton type="submit" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? "Updating..." : "Change password"}
          </AppButton>
        </Stack>
      </SectionCard>
    </Stack>
  );
};
