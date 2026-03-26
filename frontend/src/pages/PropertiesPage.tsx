import { useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyFilters } from "../components/dashboard/PropertyFilters";
import { SavedPropertiesPanel } from "../components/dashboard/SavedPropertiesPanel";
import { PropertyInsights } from "../components/dashboard/PropertyInsights";
import { AppButton } from "../components/ui/AppButton";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { usePortalData } from "../hooks/usePortalData";
import { useAuthStore } from "../stores/authStore";

export const PropertiesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
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
    propertiesQuery,
    favouritesQuery,
    blockingUserError,
    userError,
    propertiesError,
    favouritesError,
    clearFeedback,
    toggleFavourite,
  } = usePortalData();

  const filteredProperties = properties.filter((property) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      property.title.toLowerCase().includes(normalizedSearch) ||
      property.city.toLowerCase().includes(normalizedSearch);
    const matchesCity = selectedCity === "all" || property.city === selectedCity;
    const matchesSaved = !showSavedOnly || Boolean(property.isFavourite);

    return matchesSearch && matchesCity && matchesSaved;
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
        eyebrow="Listings"
        title="Browse properties"
        subtitle="Use search and city filters to narrow the catalogue, then save homes you want to compare later."
        actions={
          <Typography variant="body2" color="text.secondary">
            {filteredProperties.length} matching {filteredProperties.length === 1 ? "home" : "homes"}
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

      {!propertiesError ? (
        <PropertyFilters
          searchTerm={searchTerm}
          selectedCity={selectedCity}
          showSavedOnly={showSavedOnly}
          cities={cities}
          resultCount={filteredProperties.length}
          onSearchTermChange={setSearchTerm}
          onCityChange={setSelectedCity}
          onShowSavedOnlyChange={setShowSavedOnly}
          onClearFilters={() => {
            setSearchTerm("");
            setSelectedCity("all");
            setShowSavedOnly(false);
          }}
        />
      ) : null}

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <SectionCard
            title="Property catalogue"
            description="All currently available homes are listed here."
            action={
              propertiesError ? (
                <AppButton
                  variant="outlined"
                  startIcon={<RefreshOutlinedIcon />}
                  onClick={() => propertiesQuery.refetch()}
                >
                  Retry listings
                </AppButton>
              ) : null
            }
          >
            {propertiesQuery.isLoading ? (
              <Box sx={{ minHeight: 280, display: "grid", placeItems: "center" }}>
                <CircularProgress />
              </Box>
            ) : propertiesError ? (
              <ErrorState
                title={propertiesError.title}
                description={propertiesError.message}
                action={
                  <AppButton
                    startIcon={<RefreshOutlinedIcon />}
                    onClick={() => propertiesQuery.refetch()}
                  >
                    Try again
                  </AppButton>
                }
              />
            ) : filteredProperties.length === 0 ? (
              <EmptyState
                icon={<HomeOutlinedIcon />}
                title="No properties match these filters"
                description="Try clearing the search or city filters to see more homes."
                action={
                  searchTerm || selectedCity !== "all" || showSavedOnly ? (
                    <AppButton
                      variant="outlined"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCity("all");
                        setShowSavedOnly(false);
                      }}
                    >
                      Clear filters
                    </AppButton>
                  ) : null
                }
              />
            ) : (
              <Grid2 container spacing={3}>
                {filteredProperties.map((property) => (
                  <Grid2 key={property.id} size={{ xs: 12, md: 6 }}>
                    <PropertyCard
                      property={property}
                      onToggleFavourite={toggleFavourite}
                      busy={busyPropertyId === property.id}
                    />
                  </Grid2>
                ))}
              </Grid2>
            )}
          </SectionCard>
        </Grid2>

        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <SectionCard
              title="Saved preview"
              description="A quick look at your shortlist while you browse."
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
            <PropertyInsights
              totalProperties={properties.length}
              favouriteCount={favourites.length}
              cityCount={cities.length}
              averagePriceLabel={`$${averagePrice.toLocaleString("en-US")}`}
            />
            <SectionCard
              title="Shortlist status"
              description="Track how many homes you have ready for comparison."
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <TurnedInNotOutlinedIcon color="action" fontSize="small" />
                <Typography color="text.secondary">
                  {favourites.length} saved {favourites.length === 1 ? "home" : "homes"} available
                  in your shortlist.
                </Typography>
              </Stack>
            </SectionCard>
          </Stack>
        </Grid2>
      </Grid2>
    </Stack>
  );
};
