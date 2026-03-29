import { useEffect } from "react";
import { Grid2, Stack, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import { AppButton } from "../components/ui/AppButton";
import { DashboardAnalytics } from "../components/dashboard/DashboardAnalytics";
import { ErrorState } from "../components/ui/ErrorState";
import { PageHeader } from "../components/ui/PageHeader";
import { DashboardPageSkeleton } from "../components/ui/AppSkeletons";
import { SectionCard } from "../components/ui/SectionCard";
import { StatCard } from "../components/ui/StatCard";
import { usePortalData } from "../hooks/usePortalData";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";

export const DashboardPage = () => {
  const clearSession = useAuthStore((state) => state.clearSession);
  const showToast = useToastStore((state) => state.showToast);
  const {
    user,
    properties,
    favourites,
    cities,
    averagePrice,
    userQuery,
    propertiesQuery,
    favouritesQuery,
    propertyCitiesQuery,
    blockingUserError,
    userError,
  } = usePortalData();

  useEffect(() => {
    if (userError) {
      showToast(`${userError.message} Showing the last available profile details.`, "warning");
    }
  }, [showToast, userError]);

  if (userQuery.isLoading && !user) {
    return <DashboardPageSkeleton />;
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
        eyebrow="Dashboard"
        title={`Welcome, ${user?.name ?? "Buyer"}`}
        subtitle=""
        actions={
          <Typography variant="body2" color="text.secondary">
            Role: {user?.role ?? "buyer"}
          </Typography>
        }
      />
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
          <StatCard
            label="Active listings"
            value={properties.length.toString()}
            helper="Current properties available in the portal."
            icon={<HomeOutlinedIcon />}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
          <StatCard
            label="Saved homes"
            value={favourites.length.toString()}
            helper="Properties you have already shortlisted."
            icon={<TurnedInNotOutlinedIcon />}
            tone="secondary"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
          <StatCard
            label="Average price"
            value={
              <Stack spacing={0.25}>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 700, letterSpacing: 0.6 }}
                >
                  NPR
                </Typography>
                <Typography component="span" variant="h4" fontWeight={600} sx={{ lineHeight: 1.1 }}>
                  {averagePrice.toLocaleString("en-US")}
                </Typography>
              </Stack>
            }
            helper="A quick view of the current price range."
            icon={<PriceCheckOutlinedIcon />}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, xl: 3 }}>
          <StatCard
            label="Cities"
            value={cities.length.toString()}
            helper="Locations currently available in the catalogue."
            icon={<SellOutlinedIcon />}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12 }}>
          <DashboardAnalytics
            properties={properties}
            favouriteCount={favourites.length}
            isLoading={
              propertiesQuery.isLoading ||
              favouritesQuery.isLoading ||
              propertyCitiesQuery.isLoading ||
              propertiesQuery.isFetching ||
              favouritesQuery.isFetching ||
              propertyCitiesQuery.isFetching
            }
          />
        </Grid2>
      </Grid2>
    </Stack>
  );
};
