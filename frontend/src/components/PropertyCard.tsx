import { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import type { Property } from "../types";
import { AppButton } from "./ui/AppButton";

type PropertyCardProps = {
  property: Property;
  onToggleFavourite: (property: Property) => void;
  busy?: boolean;
  onViewDetails?: (property: Property) => void;
};

export const PropertyCard = ({
  property,
  onToggleFavourite,
  busy,
  onViewDetails,
}: PropertyCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        transition: "box-shadow 150ms ease",
        "&:hover": {
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 4px 12px rgba(0, 0, 0, 0.08)"
              : "0 4px 12px rgba(0, 0, 0, 0.24)",
        },
      }}
      elevation={0}
    >
      <Box sx={{ position: "relative" }}>
        {imageFailed ? (
          <Stack
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{
              height: 200,
              bgcolor: "action.hover",
              color: "text.secondary",
            }}
          >
            <ImageNotSupportedOutlinedIcon />
            <Typography variant="body2">Image unavailable</Typography>
          </Stack>
        ) : (
          <CardMedia
            component="img"
            height="200"
            image={property.imageUrl}
            alt={property.title}
            onError={() => setImageFailed(true)}
          />
        )}
        <Chip
          size="small"
          icon={
            property.isFavourite ? (
              <BookmarkOutlinedIcon fontSize="small" />
            ) : (
              <BookmarkBorderOutlinedIcon fontSize="small" />
            )
          }
          label={property.isFavourite ? "Saved" : "Available"}
          sx={(theme) => ({
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: 500,
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: "blur(4px)",
          })}
        />
      </Box>

      <Stack sx={{ p: 2.5, flexGrow: 1, gap: 2 }}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {property.title}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <LocationOnOutlinedIcon sx={{ fontSize: 16 }} color="action" />
            <Typography variant="body2" color="text.secondary" noWrap>
              {property.city}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
              Price
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              ${property.price.toLocaleString("en-US")}
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            fontWeight={500}
            color={property.isFavourite ? "primary.main" : "text.secondary"}
          >
            {property.isFavourite ? "Shortlisted" : "Available"}
          </Typography>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: "auto" }}>
          {onViewDetails ? (
            <AppButton fullWidth variant="outlined" onClick={() => onViewDetails(property)}>
              View details
            </AppButton>
          ) : null}
          <AppButton
            fullWidth
            variant={property.isFavourite ? "outlined" : "contained"}
            startIcon={
              property.isFavourite ? (
                <BookmarkOutlinedIcon />
              ) : (
                <BookmarkBorderOutlinedIcon />
              )
            }
            onClick={() => onToggleFavourite(property)}
            disabled={busy}
          >
            {property.isFavourite ? "Remove" : "Save property"}
          </AppButton>
        </Stack>
      </Stack>
    </Card>
  );
};
