import { Alert, Box, CircularProgress, Grid2, Stack, Typography } from "@mui/material";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { useNavigate } from "react-router-dom";
import { SavedPropertiesPanel } from "../components/dashboard/SavedPropertiesPanel";
import { PropertyInsights } from "../components/dashboard/PropertyInsights";
import { AppButton } from "../components/ui/AppButton";
import { ErrorState } from "../components/ui/ErrorState";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { usePortalData } from "../hooks/usePortalData";
import { useAuthStore } from "../stores/authStore";

export const SavedHomesPage = () => {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);
  const {
    user,
    properties,
    favourites,
    cities,
    averagePrice,
    feedback,
    busyPropertyId,
    userQuery,
    favouritesQuery,
    blockingUserError,
    userError,
    favouritesError,
    clearFeedback,
    toggleFavourite,
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
        eyebrow="Saved Homes"
        title="Your shortlist"
        subtitle="Review saved homes in one place, remove any that are no longer relevant, and jump back to listings when you want to keep exploring."
        actions={
          <Typography variant="body2" color="text.secondary">
            {favourites.length} saved {favourites.length === 1 ? "property" : "properties"}
          </Typography>
        }
      />

      {userError ? (
        <Alert severity="warning" onClose={() => userQuery.refetch()}>
          {userError.message} Showing the last available profile details.
        </Alert>
      ) : null}

      {feedback ? (
        <Alert severity={feedback.severity} onClose={clearFeedback}>
          {feedback.message}
        </Alert>
      ) : null}

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <SectionCard
            title="Saved homes"
            description="Everything you have shortlisted appears here."
            action={
              favouritesError ? (
                <AppButton
                  variant="outlined"
                  startIcon={<RefreshOutlinedIcon />}
                  onClick={() => favouritesQuery.refetch()}
                >
                  Retry saved homes
                </AppButton>
              ) : null
            }
          >
            {favouritesQuery.isLoading ? (
              <Box sx={{ minHeight: 260, display: "grid", placeItems: "center" }}>
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
            ) : favourites.length === 0 ? (
              <ErrorState
                icon={<BookmarkBorderOutlinedIcon />}
                title="No saved homes yet"
                description="Browse listings and save the homes you want to compare later."
                action={
                  <AppButton onClick={() => navigate("/dashboard/listings")}>
                    Browse listings
                  </AppButton>
                }
              />
            ) : (
              <SavedPropertiesPanel
                favourites={favourites}
                busyPropertyId={busyPropertyId}
                onRemoveFavourite={toggleFavourite}
              />
            )}
          </SectionCard>
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
              title="Next steps"
              description="Move between your saved list and the full catalogue without losing context."
            >
              <Stack spacing={1.5}>
                <AppButton onClick={() => navigate("/dashboard/listings")}>
                  Browse more listings
                </AppButton>
                <AppButton variant="outlined" onClick={() => navigate("/dashboard")}>
                  Go to overview
                </AppButton>
              </Stack>
            </SectionCard>
          </Stack>
        </Grid2>
      </Grid2>
    </Stack>
  );
};
