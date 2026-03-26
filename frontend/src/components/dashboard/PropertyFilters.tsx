import {
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
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
    <SectionCard contentSx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: "column", xl: "row" }}
          spacing={2}
          alignItems={{ xl: "center" }}
          justifyContent="space-between"
        >
          <AppTextField
            label="Search homes"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Search by city or title"
            size="small"
            sx={{ maxWidth: { xl: 420 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems={{ sm: "center" }}
            justifyContent={{ sm: "space-between" }}
            sx={{ width: { xs: "100%", xl: "auto" } }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={showSavedOnly}
                  onChange={(event) => onShowSavedOnlyChange(event.target.checked)}
                />
              }
              label="Saved only"
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={(theme) => ({
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 999,
                  backgroundColor: alpha(theme.palette.primary.main, 0.06),
                })}
              >
                Showing {resultCount} {resultCount === 1 ? "property" : "properties"}
              </Typography>
              {hasActiveFilters ? (
                <Tooltip title="Clear filters">
                  <IconButton onClick={onClearFilters}>
                    <ClearOutlinedIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Stack>
          </Stack>
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
      </Stack>
    </SectionCard>
  );
};
