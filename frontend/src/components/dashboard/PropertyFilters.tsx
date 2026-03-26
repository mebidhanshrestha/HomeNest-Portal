import {
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { AppTextField } from "../ui/AppTextField";
import { AppButton } from "../ui/AppButton";
import { SectionCard } from "../ui/SectionCard";

type PropertyFiltersProps = {
  searchTerm: string;
  selectedCity: string;
  showSavedOnly: boolean;
  cities: string[];
  resultCount: number;
  onSearchTermChange: (value: string) => void;
  onCityChange: (city: string) => void;
  onShowSavedOnlyChange: (checked: boolean) => void;
  onClearFilters: () => void;
};

export const PropertyFilters = ({
  searchTerm,
  selectedCity,
  showSavedOnly,
  cities,
  resultCount,
  onSearchTermChange,
  onCityChange,
  onShowSavedOnlyChange,
  onClearFilters,
}: PropertyFiltersProps) => {
  const hasActiveFilters = Boolean(searchTerm) || selectedCity !== "all" || showSavedOnly;

  return (
    <SectionCard
      title="Browse listings"
      description="Search by city or title, then narrow the list to your saved homes if needed."
      action={
        hasActiveFilters ? (
          <Tooltip title="Clear filters">
            <IconButton onClick={onClearFilters}>
              <ClearOutlinedIcon />
            </IconButton>
          </Tooltip>
        ) : null
      }
    >
      <Stack spacing={2.5}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
          <AppTextField
            label="Search homes"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Search by city or title"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showSavedOnly}
                onChange={(event) => onShowSavedOnlyChange(event.target.checked)}
              />
            }
            label="Saved only"
          />
        </Stack>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <AppButton
            variant={selectedCity === "all" ? "contained" : "outlined"}
            onClick={() => onCityChange("all")}
          >
            All cities
          </AppButton>
          {cities.map((city) => (
            <AppButton
              key={city}
              variant={selectedCity === city ? "contained" : "outlined"}
              onClick={() => onCityChange(city)}
            >
              {city}
            </AppButton>
          ))}
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Showing {resultCount} {resultCount === 1 ? "property" : "properties"}.
        </Typography>
      </Stack>
    </SectionCard>
  );
};
