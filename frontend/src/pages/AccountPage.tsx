import { useEffect } from "react";
import { Avatar, Box, CircularProgress, Stack, Typography } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/authService";
import { AppButton } from "../components/ui/AppButton";
import { AppBreadcrumbs } from "../components/ui/AppBreadcrumbs";
import { AppTextField } from "../components/ui/AppTextField";
import { ErrorState } from "../components/ui/ErrorState";
import { SectionCard } from "../components/ui/SectionCard";
import { normalizeAppError } from "../lib/api";
import { usePortalData } from "../hooks/usePortalData";
import { getAvatarColors } from "../lib/avatarColor";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const AccountPage = () => {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);
  const showToast = useToastStore((state) => state.showToast);
  const {
    user,
    userQuery,
    blockingUserError,
    userError,
  } = usePortalData({
    includeProperties: false,
    includeFavourites: false,
    includeCities: false,
  });
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
  const avatarColors = getAvatarColors(user?.email ?? user?.name);

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (message) => {
      showToast(message, "success");
      reset();
    },
    onError: (error) => {
      const details = normalizeAppError(error, "We could not update your password.");
      showToast(details.message, "error");
    },
  });

  useEffect(() => {
    if (userError) {
      showToast(`${userError.message} Showing the last available profile details.`, "warning");
    }
  }, [showToast, userError]);

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
      <AppBreadcrumbs
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Account" },
        ]}
        actions={
          <AppButton
            variant="contained"
            color="error"
            startIcon={<LogoutOutlinedIcon />}
            onClick={() => {
              clearSession();
              navigate("/auth", { replace: true });
            }}
          >
            Sign out
          </AppButton>
        }
      />
      <SectionCard title="Account details" description="Your current account information.">
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ sm: "center" }}>
          <Avatar
            sx={{
              width: 84,
              height: 84,
              bgcolor: avatarColors.bg,
              color: avatarColors.fg,
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
