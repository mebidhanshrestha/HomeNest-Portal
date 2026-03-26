import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import type { Property } from "../types";
import { AppButton } from "./ui/AppButton";

type PropertyCardProps = {
  property: Property;
  onToggleFavourite: (property: Property) => void;
  busy?: boolean;
};

export const PropertyCard = ({ property, onToggleFavourite, busy }: PropertyCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Card sx={{ height: "100%", overflow: "hidden" }}>
      <Box sx={{ position: "relative" }}>
        {imageFailed ? (
          <Stack
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{
              height: 240,
              px: 2,
              bgcolor: "action.hover",
              color: "text.secondary",
            }}
          >
            <ImageNotSupportedOutlinedIcon />
            <Typography variant="body2">Property image unavailable</Typography>
          </Stack>
        ) : (
          <CardMedia
            component="img"
            height="240"
            image={property.imageUrl}
            alt={property.title}
            onError={() => setImageFailed(true)}
          />
        )}
        <Chip
          icon={property.isFavourite ? <BookmarkAddedOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
          label={property.isFavourite ? "Saved" : "Ready to save"}
          color={property.isFavourite ? "secondary" : "default"}
          sx={{ position: "absolute", top: 16, left: 16 }}
        />
      </Box>

      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="h6">{property.title}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOnOutlinedIcon color="action" fontSize="small" />
            <Typography color="text.secondary">{property.city}</Typography>
          </Stack>
        </Stack>

        <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-end">
          <Stack spacing={0.75}>
            <Typography variant="body2" color="text.secondary">
              Guide price
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <SellOutlinedIcon color="action" fontSize="small" />
              <Typography variant="h6">
                ${property.price.toLocaleString("en-US")}
              </Typography>
            </Stack>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {property.isFavourite ? "Shortlisted" : "Available"}
          </Typography>
        </Stack>

        <AppButton
          fullWidth
          variant={property.isFavourite ? "outlined" : "contained"}
          startIcon={
            property.isFavourite ? <BookmarkAddedOutlinedIcon /> : <FavoriteBorderOutlinedIcon />
          }
          onClick={() => onToggleFavourite(property)}
          disabled={busy}
        >
          {property.isFavourite ? "Remove from saved" : "Save property"}
        </AppButton>
      </CardContent>
    </Card>
  );
};
