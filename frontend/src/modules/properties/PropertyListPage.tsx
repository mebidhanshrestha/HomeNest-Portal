import { useEffect, useState } from "react";
import { Grid2, Stack, TablePagination } from "@mui/material";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { useNavigate } from "react-router-dom";
import { PropertyCard } from "../../components/PropertyCard";
import { PropertyFilters } from "../../components/dashboard/PropertyFilters";
import { AppButton } from "../../components/ui/AppButton";
import { AppBreadcrumbs } from "../../components/ui/AppBreadcrumbs";
import { PropertyFiltersSkeleton, PropertyGridSkeleton, PropertyListSkeleton } from "../../components/ui/AppSkeletons";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { SectionCard } from "../../components/ui/SectionCard";
import { usePortalData } from "../../hooks/usePortalData";
import { useAuthStore } from "../../stores/authStore";
import { useToastStore } from "../../stores/toastStore";

export const PropertyListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const clearSession = useAuthStore((state) => state.clearSession);
  const showToast = useToastStore((state) => state.showToast);
  const navigate = useNavigate();
  const {
    user,
    properties,
    busyPropertyId,
    userQuery,
    propertiesQuery,
    propertiesPagination,
    blockingUserError,
    userError,
    propertiesError,
    toggleFavourite,
    cities,
  } = usePortalData({
    includeProperties: true,
    includeFavourites: false,
    includeCities: true,
    propertiesPage: page,
    propertiesPageSize: rowsPerPage,
    propertiesSearch: searchTerm,
    propertiesCity: selectedCity === "all" ? "" : selectedCity,
    propertiesSavedOnly: showSavedOnly,
  });

  useEffect(() => {
    if (userError) {
      showToast(
        `${userError.message} Showing the last available profile details.`,
        "warning",
      );
    }
  }, [showToast, userError]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCity, showSavedOnly, rowsPerPage]);

  if (userQuery.isLoading && !user) {
    return <PropertyListSkeleton />;
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
      <AppBreadcrumbs
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Properties" },
        ]}
        actions={
          <AppButton
            startIcon={<AddHomeOutlinedIcon />}
            onClick={() => navigate("/dashboard/properties/new")}
          >
            Create property
          </AppButton>
        }
      />
      {propertiesQuery.isLoading ? (
        <PropertyFiltersSkeleton />
      ) : !propertiesError ? (
        <PropertyFilters
          searchTerm={searchTerm}
          selectedCity={selectedCity}
          showSavedOnly={showSavedOnly}
          cities={cities}
          resultCount={propertiesPagination.totalItems}
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
          <PropertyGridSkeleton />
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
        ) : properties.length === 0 ? (
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
          <Stack spacing={3}>
            <Grid2 container spacing={3}>
              {properties.map((property) => (
                <Grid2 key={property.id} size={{ xs: 12, md: 6, xl: 4 }}>
                  <PropertyCard
                    property={property}
                    onToggleFavourite={toggleFavourite}
                    busy={busyPropertyId === property.id}
                    onViewDetails={() =>
                      navigate(`/dashboard/properties/${property.id}`)
                    }
                  />
                </Grid2>
              ))}
            </Grid2>
            <TablePagination
              component="div"
              count={propertiesPagination.totalItems}
              page={Math.max(propertiesPagination.page - 1, 0)}
              onPageChange={(_event, nextPage) => setPage(nextPage + 1)}
              rowsPerPage={propertiesPagination.pageSize}
              onRowsPerPageChange={(event) => {
                const nextRowsPerPage = Number(event.target.value);
                setRowsPerPage(nextRowsPerPage);
                setPage(1);
              }}
              rowsPerPageOptions={[6, 9, 12, 24]}
              sx={{
                borderTop: "1px solid",
                borderColor: "divider",
                pt: 1,
              }}
            />
          </Stack>
        )}
      </SectionCard>
    </Stack>
  );
};
