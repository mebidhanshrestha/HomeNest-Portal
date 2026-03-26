import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { useNavigate } from "react-router-dom";
import { AppButton } from "../components/ui/AppButton";
import { ErrorState } from "../components/ui/ErrorState";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { StatCard } from "../components/ui/StatCard";
import { usePortalData } from "../hooks/usePortalData";
import { useAuthStore } from "../stores/authStore";
import { useThemeStore } from "../stores/themeStore";

export const AccountPage = () => {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const {
    user,
    properties,
    favourites,
    cities,
    averagePrice,
    userQuery,
    blockingUserError,
    userError,
  } = usePortalData();

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
              <AppButton
                startIcon={<RefreshOutlinedIcon />}
                onClick={() => userQuery.refetch()}
              >
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
        title="Profile and preferences"
        subtitle="Review your buyer account details, theme preference, and a quick summary of your activity in the portal."
      />

      {userError ? (
        <Alert severity="warning" onClose={() => userQuery.refetch()}>
          {userError.message} Showing the last available profile details.
        </Alert>
      ) : null}

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
          <StatCard
            label="Saved homes"
            value={favourites.length.toString()}
            helper="Current shortlist size."
            icon={<BadgeOutlinedIcon />}
            tone="secondary"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
          <StatCard
            label="Listings"
            value={properties.length.toString()}
            helper="Homes currently available in the portal."
            icon={<PersonOutlineOutlinedIcon />}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
          <StatCard
            label="Cities"
            value={cities.length.toString()}
            helper="Active locations in the catalogue."
            icon={<TuneOutlinedIcon />}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
          <StatCard
            label="Average price"
            value={`$${averagePrice.toLocaleString("en-US")}`}
            helper="Average listing price right now."
            icon={<DarkModeOutlinedIcon />}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, lg: 7 }}>
          <SectionCard title="Profile" description="Your current buyer account details.">
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
                <Stack direction="row" spacing={1} alignItems="center">
                  <BadgeOutlinedIcon fontSize="small" color="action" />
                  <Typography color="text.secondary">
                    Role: {user?.role ?? "buyer"}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </SectionCard>
        </Grid2>

        <Grid2 size={{ xs: 12, lg: 5 }}>
          <SectionCard
            title="Appearance"
            description="Switch between light and dark mode for the entire portal."
          >
            <Stack spacing={2}>
              <Typography color="text.secondary">
                Current mode: {mode === "light" ? "Light" : "Dark"}
              </Typography>
              <AppButton
                variant="outlined"
                startIcon={<DarkModeOutlinedIcon />}
                onClick={toggleMode}
              >
                Toggle theme
              </AppButton>
            </Stack>
          </SectionCard>
        </Grid2>

        <Grid2 size={{ xs: 12, lg: 7 }}>
          <SectionCard
            title="Workspace summary"
            description="A simple snapshot of how you are using the buyer portal."
          >
            <Stack spacing={1.25}>
              <Typography color="text.secondary">
                You currently have {favourites.length} saved {favourites.length === 1 ? "home" : "homes"} and {properties.length} active listings available to review.
              </Typography>
              <Typography color="text.secondary">
                The catalogue spans {cities.length} {cities.length === 1 ? "city" : "cities"}, with an average price of ${averagePrice.toLocaleString("en-US")}.
              </Typography>
            </Stack>
          </SectionCard>
        </Grid2>

        <Grid2 size={{ xs: 12, lg: 5 }}>
          <SectionCard
            title="Session actions"
            description="Move to other sections or sign out of the portal."
          >
            <Stack spacing={1.5}>
              <AppButton onClick={() => navigate("/dashboard/listings")}>
                Go to listings
              </AppButton>
              <AppButton variant="outlined" onClick={() => navigate("/dashboard/saved")}>
                View saved homes
              </AppButton>
              <AppButton
                variant="outlined"
                color="secondary"
                startIcon={<LogoutOutlinedIcon />}
                onClick={() => {
                  clearSession();
                  navigate("/auth", { replace: true });
                }}
              >
                Logout
              </AppButton>
            </Stack>
          </SectionCard>
        </Grid2>
      </Grid2>
    </Stack>
  );
};
