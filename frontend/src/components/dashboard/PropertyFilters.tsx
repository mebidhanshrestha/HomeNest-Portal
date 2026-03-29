import { useEffect } from "react";
import {
  Autocomplete,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
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
  const cityOptions = ["all", ...cities];
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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems={{ sm: "center" }}
            sx={{ width: { xs: "100%", xl: "auto" }, flexWrap: "wrap" }}
          >
            <Controller
              name="selectedCity"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={cityOptions}
                  value={field.value}
                  onChange={(_event, value) => field.onChange(value ?? "all")}
                  size="small"
                  disableClearable
                  sx={{ minWidth: { xs: "100%", sm: 240 } }}
                  getOptionLabel={(option) => (option === "all" ? "All cities" : option)}
                  renderInput={(params) => (
                    <AppTextField
                      {...params}
                      label="City"
                      placeholder="Select city"
                    />
                  )}
                />
              )}
            />
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

          <AppTextField
            label="Title/ City"
            placeholder="Search..."
            size="small"
            sx={{
              width: { xs: "100%", xl: 230 },
              ml: { xl: "auto" },
              "& .MuiInputLabel-root": {
                fontSize: "0.8rem",
              },
              "& .MuiOutlinedInput-root": {
                minHeight: 38,
                backgroundColor: "background.paper",
              },
              "& .MuiOutlinedInput-input": {
                py: 1,
              },
            }}
            {...register("searchTerm")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
    </SectionCard>
  );
};
