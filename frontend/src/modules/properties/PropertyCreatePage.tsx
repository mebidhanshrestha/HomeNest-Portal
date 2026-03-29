import { Stack } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AppButton } from "../../components/ui/AppButton";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { normalizeAppError } from "../../lib/api";
import { createProperty, type CreatePropertyPayload } from "../../services/propertyService";
import { useToastStore } from "../../stores/toastStore";
import { PropertyCreateForm } from "./PropertyCreateForm";

export const PropertyCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);
  const createMutation = useMutation({
    mutationFn: (payload: CreatePropertyPayload) => createProperty(payload),
    onSuccess: async (property) => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      showToast("Property created successfully.", "success");
      navigate(`/dashboard/properties/${property.id}`, { replace: true });
    },
    onError: (error) => {
      const details = normalizeAppError(error, "We could not create the property.");
      showToast(details.message, "error");
    },
  });

  return (
    <Stack spacing={4}>
      <PageHeader
        eyebrow="Properties"
        title="Create property"
        subtitle="Add a new property to the catalogue with its core listing information."
        actions={
          <AppButton variant="outlined" onClick={() => navigate("/dashboard/properties")}>
            Back to list
          </AppButton>
        }
      />
      <SectionCard title="New property" description="Enter the listing details below.">
        <PropertyCreateForm
          isPending={createMutation.isPending}
          onSubmit={(values) => createMutation.mutate(values)}
        />
      </SectionCard>
    </Stack>
  );
};
