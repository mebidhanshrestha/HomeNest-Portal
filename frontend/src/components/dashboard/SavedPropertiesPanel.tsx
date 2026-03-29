import { Avatar, IconButton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { EmptyState } from "../ui/EmptyState";
import type { Property } from "../../types";

type SavedPropertiesPanelProps = {
  favourites: Property[];
  busyPropertyId?: number | null;
  onRemoveFavourite: (property: Property) => void;
};

export const SavedPropertiesPanel = ({
  favourites,
  busyPropertyId,
  onRemoveFavourite,
}: SavedPropertiesPanelProps) => (
  <>
    {favourites.length === 0 ? (
      <EmptyState
        icon={<BookmarkBorderOutlinedIcon />}
        title="No saved homes yet"
        description="Save a property from the listing grid to build your shortlist."
      />
    ) : (
      <Stack spacing={2}>
        {favourites.map((property) => (
          <Stack
            key={property.id}
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={(theme) => ({
              p: 1.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: alpha(theme.palette.primary.main, 0.08),
              backgroundColor: alpha(theme.palette.primary.main, 0.035),
            })}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
              <Avatar
                variant="rounded"
                src={property.imageUrl}
                alt={property.title}
                sx={{ width: 72, height: 72, borderRadius: 3 }}
              />
              <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" noWrap>
                  {property.title}
                </Typography>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <LocationOnOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {property.city}
                  </Typography>
                </Stack>
                <Typography variant="subtitle2">
                  NPR {property.price.toLocaleString("en-US")}
                </Typography>
              </Stack>
            </Stack>
            <IconButton
              aria-label={`Remove ${property.title} from favourites`}
              disabled={busyPropertyId === property.id}
              onClick={() => onRemoveFavourite(property)}
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    )}
  </>
);
