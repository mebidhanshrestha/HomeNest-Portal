import { useState } from "react";
import { Alert, Box, CircularProgress, Grid2, Stack, Typography } from "@mui/material";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { useNavigate } from "react-router-dom";
import { PropertyCard } from "../../components/PropertyCard";
import { PropertyFilters } from "../../components/dashboard/PropertyFilters";
import { AppButton } from "../../components/ui/AppButton";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { usePortalData } from "../../hooks/usePortalData";
import { useAuthStore } from "../../stores/authStore";

export const PropertyListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();
  const {
    user,
    properties,
    feedback,
    busyPropertyId,
    userQuery,
    propertiesQuery,
    blockingUserError,
    userError,
    propertiesError,
    clearFeedback,
    toggleFavourite,
    cities,
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
        eyebrow="Properties"
        title="Properties"
        subtitle="Browse and manage the property catalogue."
        actions={
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"}
            </Typography>
            <AppButton startIcon={<AddHomeOutlinedIcon />} onClick={() => navigate("/dashboard/properties/new")}>
              Create property
            </AppButton>
          </Stack>
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

      <SectionCard
        title="Property list"
        description="All currently available properties are listed here."
        action={
          propertiesError ? (
            <AppButton
              variant="outlined"
              startIcon={<RefreshOutlinedIcon />}
              onClick={() => propertiesQuery.refetch()}
            >
              Retry properties
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
              <AppButton startIcon={<RefreshOutlinedIcon />} onClick={() => propertiesQuery.refetch()}>
                Try again
              </AppButton>
            }
          />
        ) : filteredProperties.length === 0 ? (
          <EmptyState
            icon={<HomeOutlinedIcon />}
            title="No properties match these filters"
            description="Try clearing the search or city filters to see more properties."
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
              <Grid2 key={property.id} size={{ xs: 12, md: 6, xl: 4 }}>
                <PropertyCard
                  property={property}
                  onToggleFavourite={toggleFavourite}
                  busy={busyPropertyId === property.id}
                  onViewDetails={() => navigate(`/dashboard/properties/${property.id}`)}
                />
              </Grid2>
            ))}
          </Grid2>
        )}
      </SectionCard>
    </Stack>
  );
};
