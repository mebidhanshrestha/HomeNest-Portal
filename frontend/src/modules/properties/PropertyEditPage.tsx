import { Alert, Box, CircularProgress, Stack } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { AppButton } from "../../components/ui/AppButton";
import { ErrorState } from "../../components/ui/ErrorState";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { normalizeAppError } from "../../lib/api";
import { getProperty, updateProperty, type PropertyPayload } from "../../services/propertyService";
import { PropertyForm } from "./PropertyForm";

export const PropertyEditPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const propertyId = Number(useParams().id);
  const propertyQuery = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => getProperty(propertyId),
    enabled: Number.isFinite(propertyId),
  });
  const updateMutation = useMutation({
    mutationFn: (payload: PropertyPayload) => updateProperty(propertyId, payload),
    onSuccess: async (property) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
        queryClient.invalidateQueries({ queryKey: ["property", property.id] }),
      ]);
      navigate(`/dashboard/properties/${property.id}`);
    },
  });

  const propertyError = propertyQuery.isError
    ? normalizeAppError(propertyQuery.error, "We could not load the property.")
    : null;
  const updateError = updateMutation.isError
    ? normalizeAppError(updateMutation.error, "We could not update the property.")
    : null;

  return (
    <Stack spacing={4}>
      <PageHeader
        eyebrow="Properties"
        title="Edit property"
        subtitle="Update the listing details for this property."
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
            {updateError ? <Alert severity="error">{updateError.message}</Alert> : null}
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
