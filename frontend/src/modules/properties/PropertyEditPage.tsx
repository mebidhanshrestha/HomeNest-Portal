import { Box, CircularProgress, Stack } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { AppButton } from "../../components/ui/AppButton";
import { AppBreadcrumbs } from "../../components/ui/AppBreadcrumbs";
import { ErrorState } from "../../components/ui/ErrorState";
import { SectionCard } from "../../components/ui/SectionCard";
import { normalizeAppError } from "../../lib/api";
import { getProperty, updateProperty, type PropertyPayload } from "../../services/propertyService";
import { useAuthStore } from "../../stores/authStore";
import { useToastStore } from "../../stores/toastStore";
import { PropertyForm } from "./PropertyForm";

export const PropertyEditPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);
  const authScope = useAuthStore((state) => state.user?.id ?? state.token ?? "anonymous");
  const propertyId = Number(useParams().id);
  const propertyQuery = useQuery({
    queryKey: ["property", authScope, propertyId],
    queryFn: () => getProperty(propertyId),
    enabled: Number.isFinite(propertyId),
  });
  const updateMutation = useMutation({
    mutationFn: (payload: PropertyPayload) => updateProperty(propertyId, payload),
    onSuccess: async (property) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
        queryClient.invalidateQueries({ queryKey: ["property"] }),
      ]);
      showToast("Property updated successfully.", "success");
      navigate(`/dashboard/properties/${property.id}`);
    },
    onError: (error) => {
      const details = normalizeAppError(error, "We could not update the property.");
      showToast(details.message, "error");
    },
  });

  const propertyError = propertyQuery.isError
    ? normalizeAppError(propertyQuery.error, "We could not load the property.")
    : null;

  return (
    <Stack spacing={4}>
      <AppBreadcrumbs
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Properties", to: "/dashboard/properties" },
          {
            label: propertyQuery.data?.title ?? "Property detail",
            to: Number.isFinite(propertyId) ? `/dashboard/properties/${propertyId}` : undefined,
          },
          { label: "Edit" },
        ]}
        actions={
          <AppButton variant="outlined" onClick={() => navigate(`/dashboard/properties/${propertyId}`)}>
            Back to detail
          </AppButton>
        }
      />
      <SectionCard title="Property details" description="Adjust the listing information and save your changes.">
        {propertyQuery.isLoading ? (
          <Box sx={{ minHeight: 280, display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </Box>
        ) : propertyError || !propertyQuery.data ? (
          <ErrorState
            title={propertyError?.title ?? "Not found"}
            description={propertyError?.message ?? "The property could not be loaded."}
          />
        ) : (
          <>
            <PropertyForm
              defaultValues={{
                title: propertyQuery.data.title,
                city: propertyQuery.data.city,
                price: propertyQuery.data.price.toString(),
                imageUrl: propertyQuery.data.imageUrl,
              }}
              submitLabel="Save changes"
              isPending={updateMutation.isPending}
              onSubmit={(values) => updateMutation.mutate(values)}
            />
          </>
        )}
      </SectionCard>
    </Stack>
  );
};
