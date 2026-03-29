import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { AppButton } from "../../components/ui/AppButton";
import { ErrorState } from "../../components/ui/ErrorState";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { normalizeAppError } from "../../lib/api";
import { addFavourite, removeFavourite } from "../../services/favouriteService";
import { deleteProperty, getProperty } from "../../services/propertyService";
import { useToastStore } from "../../stores/toastStore";

export const PropertyDetailPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);
  const propertyId = Number(useParams().id);
  const propertyQuery = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => getProperty(propertyId),
    enabled: Number.isFinite(propertyId),
  });

  const favouriteMutation = useMutation({
    mutationFn: async () => {
      const property = propertyQuery.data;

      if (!property) {
        throw new Error("Property not loaded.");
      }

      if (property.isFavourite) {
        await removeFavourite(property.id);
        return "Property removed from favourites.";
      }

      await addFavourite(property.id);
      return "Property added to favourites.";
    },
    onSuccess: async (message) => {
      showToast(message, "success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
        queryClient.invalidateQueries({ queryKey: ["property", propertyId] }),
        queryClient.invalidateQueries({ queryKey: ["favourites"] }),
      ]);
    },
    onError: (error) => {
      const details = normalizeAppError(error, "We could not update favourites.");
      showToast(details.message, "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProperty(propertyId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
        queryClient.invalidateQueries({ queryKey: ["favourites"] }),
      ]);
      showToast("Property deleted successfully.", "success");
      navigate("/dashboard/properties", { replace: true });
    },
    onError: (error) => {
      const details = normalizeAppError(error, "We could not delete the property.");
      showToast(details.message, "error");
    },
  });

  const propertyError = propertyQuery.isError
    ? normalizeAppError(propertyQuery.error, "We could not load the property.")
    : null;
  const property = propertyQuery.data;

  return (
    <Stack spacing={4}>
      <PageHeader
        eyebrow="Properties"
        title={property?.title ?? "Property detail"}
        subtitle="Review listing information, update the property, or remove it from the catalogue."
        actions={
          <Stack spacing={1.5}>
            <AppButton variant="outlined" onClick={() => navigate("/dashboard/properties")}>
              Back to list
            </AppButton>
            {property ? (
              <AppButton
                startIcon={<EditOutlinedIcon />}
                onClick={() => navigate(`/dashboard/properties/${property.id}/edit`)}
              >
                Edit property
              </AppButton>
            ) : null}
          </Stack>
        }
      />
      {propertyQuery.isLoading ? (
        <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : propertyError || !property ? (
        <SectionCard>
          <ErrorState
            title={propertyError?.title ?? "Not found"}
            description={propertyError?.message ?? "The property could not be loaded."}
            action={
              <AppButton startIcon={<RefreshOutlinedIcon />} onClick={() => propertyQuery.refetch()}>
                Retry
              </AppButton>
            }
          />
        </SectionCard>
      ) : (
        <Stack spacing={3}>
          <SectionCard>
            <Box
              component="img"
              src={property.imageUrl}
              alt={property.title}
              sx={{
                width: "100%",
                maxHeight: 420,
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
          </SectionCard>

          <SectionCard
            title="Overview"
            description="Core information for this property listing."
            action={
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <AppButton
                  variant={property.isFavourite ? "outlined" : "contained"}
                  startIcon={property.isFavourite ? <BookmarkOutlinedIcon /> : <BookmarkBorderOutlinedIcon />}
                  disabled={favouriteMutation.isPending}
                  onClick={() => favouriteMutation.mutate()}
                >
                  {property.isFavourite ? "Remove from saved" : "Save property"}
                </AppButton>
                <AppButton
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteOutlineOutlinedIcon />}
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate()}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete property"}
                </AppButton>
              </Stack>
            }
          >
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight={700}>
                {property.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceOutlinedIcon color="action" fontSize="small" />
                <Typography color="text.secondary">{property.city}</Typography>
              </Stack>
              <Typography variant="h5" color="primary.main" fontWeight={700}>
                ${property.price.toLocaleString("en-US")}
              </Typography>
              <Typography color="text.secondary">
                Created {new Date(property.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Stack>
          </SectionCard>
        </Stack>
      )}
    </Stack>
  );
};
