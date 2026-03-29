import { useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { useNavigate } from "react-router-dom";
import { SavedPropertiesPanel } from "../components/dashboard/SavedPropertiesPanel";
import { AppButton } from "../components/ui/AppButton";
import { AppBreadcrumbs } from "../components/ui/AppBreadcrumbs";
import { SavedHomesContentSkeleton, SavedHomesPageSkeleton } from "../components/ui/AppSkeletons";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { SectionCard } from "../components/ui/SectionCard";
import { usePortalData } from "../hooks/usePortalData";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";

export const SavedHomesPage = () => {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);
  const showToast = useToastStore((state) => state.showToast);
  const {
    user,
    favourites,
    busyPropertyId,
    userQuery,
    favouritesQuery,
    blockingUserError,
    userError,
    favouritesError,
    toggleFavourite,
  } = usePortalData({
    includeProperties: false,
    includeFavourites: true,
    includeCities: false,
  });

  useEffect(() => {
    if (userError) {
      showToast(`${userError.message} Showing the last available profile details.`, "warning");
    }
  }, [showToast, userError]);

  if (userQuery.isLoading && !user) {
    return <SavedHomesPageSkeleton />;
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
          { label: "Saved homes" },
        ]}
      />
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
          <SavedHomesContentSkeleton />
        ) : favouritesError ? (
          <ErrorState
            title={favouritesError.title}
            description={favouritesError.message}
            action={
              <AppButton startIcon={<RefreshOutlinedIcon />} onClick={() => favouritesQuery.refetch()}>
                Try again
              </AppButton>
            }
          />
        ) : favourites.length === 0 ? (
          <Box
            sx={(theme) => ({
              py: { xs: 5, md: 7 },
              px: 2,
              borderRadius: 3,
              border: "1px dashed",
              borderColor: theme.palette.divider,
              background:
                theme.palette.mode === "light"
                  ? "linear-gradient(180deg, rgba(139, 92, 246, 0.03), rgba(139, 92, 246, 0.01))"
                  : "linear-gradient(180deg, rgba(139, 92, 246, 0.08), rgba(139, 92, 246, 0.03))",
            })}
          >
            <EmptyState
              icon={<BookmarkBorderOutlinedIcon />}
              title="No saved homes yet"
              description="Start building your shortlist by saving a few properties you want to compare later."
              action={
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <AppButton onClick={() => navigate("/dashboard/properties")}>
                    Browse properties
                  </AppButton>
                  <AppButton variant="outlined" onClick={() => navigate("/dashboard")}>
                    Back to dashboard
                  </AppButton>
                </Stack>
              }
            />
          </Box>
        ) : (
          <SavedPropertiesPanel
            favourites={favourites}
            busyPropertyId={busyPropertyId}
            onRemoveFavourite={toggleFavourite}
          />
        )}
      </SectionCard>
    </Stack>
  );
};
