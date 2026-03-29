import { useEffect } from "react";
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
import { Controller, useForm } from "react-hook-form";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { AppButton } from "../ui/AppButton";
import { AppTextField } from "../ui/AppTextField";
import { SectionCard } from "../ui/SectionCard";

type PropertyFilterFormValues = {
  searchTerm: string;
  selectedCity: string;
  showSavedOnly: boolean;
};

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
  const { control, register, reset, setValue, watch } = useForm<PropertyFilterFormValues>({
    defaultValues: {
      searchTerm,
      selectedCity,
      showSavedOnly,
    },
  });
  const watchedSearchTerm = watch("searchTerm");
  const watchedSelectedCity = watch("selectedCity");
  const watchedShowSavedOnly = watch("showSavedOnly");
  const hasActiveFilters =
    Boolean(watchedSearchTerm) || watchedSelectedCity !== "all" || watchedShowSavedOnly;

  useEffect(() => {
    onSearchTermChange(watchedSearchTerm);
  }, [onSearchTermChange, watchedSearchTerm]);

  useEffect(() => {
    onCityChange(watchedSelectedCity);
  }, [onCityChange, watchedSelectedCity]);

  useEffect(() => {
    onShowSavedOnlyChange(watchedShowSavedOnly);
  }, [onShowSavedOnlyChange, watchedShowSavedOnly]);

  useEffect(() => {
    reset({
      searchTerm,
      selectedCity,
      showSavedOnly,
    });
  }, [reset, searchTerm, selectedCity, showSavedOnly]);

  return (
    <SectionCard contentSx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack
        component="form"
        spacing={2.5}
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Stack
          direction={{ xs: "column", xl: "row" }}
          spacing={2}
          alignItems={{ xl: "center" }}
          justifyContent="space-between"
        >
          <AppTextField
            label="Search homes"
            placeholder="Search by city or title"
            size="small"
            sx={{ maxWidth: { xl: 420 } }}
            {...register("searchTerm")}
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
              sx={{
                m: 0,
                gap: 1,
                ".MuiFormControlLabel-label": {
                  ml: 0.5,
                },
              }}
              control={
                <Controller
                  name="showSavedOnly"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      sx={{ flexShrink: 0 }}
                    />
                  )}
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
                  <IconButton
                    onClick={() => {
                      reset({
                        searchTerm: "",
                        selectedCity: "all",
                        showSavedOnly: false,
                      });
                      onClearFilters();
                    }}
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <AppButton
            type="button"
            variant={watchedSelectedCity === "all" ? "contained" : "outlined"}
            onClick={() => setValue("selectedCity", "all")}
          >
            All cities
          </AppButton>
          {cities.map((city) => (
            <AppButton
              key={city}
              type="button"
              variant={watchedSelectedCity === city ? "contained" : "outlined"}
              onClick={() => setValue("selectedCity", city)}
            >
              {city}
            </AppButton>
          ))}
        </Stack>
      </Stack>
    </SectionCard>
  );
};
