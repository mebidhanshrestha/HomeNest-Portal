import { useEffect } from "react";
import { Box, CircularProgress, Grid2, Stack, Typography } from "@mui/material";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import { useNavigate } from "react-router-dom";
import { PropertyInsights } from "../components/dashboard/PropertyInsights";
import { SavedPropertiesPanel } from "../components/dashboard/SavedPropertiesPanel";
import { AppButton } from "../components/ui/AppButton";
import { ErrorState } from "../components/ui/ErrorState";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { StatCard } from "../components/ui/StatCard";
import { usePortalData } from "../hooks/usePortalData";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);
  const showToast = useToastStore((state) => state.showToast);
  const {
    user,
    properties,
    favourites,
    cities,
    averagePrice,
    busyPropertyId,
    userQuery,
    favouritesQuery,
    blockingUserError,
    userError,
    favouritesError,
    toggleFavourite,
  } = usePortalData();

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
        eyebrow="Overview"
        title={`Welcome, ${user?.name ?? "Buyer"}`}
        subtitle="Use the sidebar to move between sections. This overview gives you the current status of the catalogue, your shortlist, and the next actions you can take."
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
            value={`$${averagePrice.toLocaleString("en-US")}`}
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
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <SectionCard
              title="Quick actions"
              description="Open the dedicated pages for browsing listings, reviewing saved homes, or managing your account."
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} useFlexGap flexWrap="wrap">
                <AppButton onClick={() => navigate("/dashboard/properties")}>
                  Browse properties
                </AppButton>
                <AppButton variant="outlined" onClick={() => navigate("/dashboard/saved")}>
                  View saved homes
                </AppButton>
                <AppButton variant="outlined" onClick={() => navigate("/dashboard/account")}>
                  Open account
                </AppButton>
              </Stack>
            </SectionCard>

            <SectionCard
              title="Saved homes preview"
              description="A quick look at the shortlist you can manage in the Saved Homes page."
              action={
                <AppButton variant="outlined" onClick={() => navigate("/dashboard/saved")}>
                  Open saved homes
                </AppButton>
              }
            >
              {favouritesQuery.isLoading ? (
                <Box sx={{ minHeight: 220, display: "grid", placeItems: "center" }}>
                  <CircularProgress />
                </Box>
              ) : favouritesError ? (
                <ErrorState
                  title={favouritesError.title}
                  description={favouritesError.message}
                  action={
                    <AppButton
                      startIcon={<RefreshOutlinedIcon />}
                      onClick={() => favouritesQuery.refetch()}
                    >
                      Try again
                    </AppButton>
                  }
                />
              ) : (
                <SavedPropertiesPanel
                  favourites={favourites.slice(0, 3)}
                  busyPropertyId={busyPropertyId}
                  onRemoveFavourite={toggleFavourite}
                />
              )}
            </SectionCard>
          </Stack>
        </Grid2>

        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <PropertyInsights
              totalProperties={properties.length}
              favouriteCount={favourites.length}
              cityCount={cities.length}
              averagePriceLabel={`$${averagePrice.toLocaleString("en-US")}`}
            />
            <SectionCard
              title="Next best step"
              description="If you have not started shortlisting homes yet, begin with the listings page."
            >
              <Stack spacing={1.5}>
                <Typography color="text.secondary">
                  {favourites.length === 0
                    ? "Start by browsing the catalogue and save the homes you want to compare."
                    : "You already have homes saved. Open the Saved Homes page to review them in detail."}
                </Typography>
                <AppButton
                  startIcon={favourites.length === 0 ? <HomeOutlinedIcon /> : <BookmarkBorderOutlinedIcon />}
                  onClick={() =>
                    navigate(favourites.length === 0 ? "/dashboard/properties" : "/dashboard/saved")
                  }
                >
                  {favourites.length === 0 ? "Open properties" : "Open saved homes"}
                </AppButton>
              </Stack>
            </SectionCard>
          </Stack>
        </Grid2>
      </Grid2>
    </Stack>
  );
};
