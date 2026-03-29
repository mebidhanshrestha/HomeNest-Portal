import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { normalizeAppError } from "../lib/api";
import { addFavourite, getFavourites, removeFavourite } from "../services/favouriteService";
import { getCurrentUser } from "../services/authService";
import { getProperties, getPropertyCities } from "../services/propertyService";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";
import type { Property } from "../types";

type UsePortalDataOptions = {
  includeProperties?: boolean;
  includeFavourites?: boolean;
  includeCities?: boolean;
  propertiesPage?: number;
  propertiesPageSize?: number;
  propertiesSearch?: string;
  propertiesCity?: string;
  propertiesSavedOnly?: boolean;
};

const favouritesQueryKey = ["favourites"];
const meQueryKey = ["me"];
const propertiesBaseQueryKey = ["properties"];
const propertyCitiesQueryKey = ["property-cities"];

export const usePortalData = (options: UsePortalDataOptions = {}) => {
  const [busyPropertyId, setBusyPropertyId] = useState<number | null>(null);
  const setSession = useAuthStore((state) => state.setSession);
  const token = useAuthStore((state) => state.token);
  const storedUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);
  const includeProperties = options.includeProperties ?? true;
  const includeFavourites = options.includeFavourites ?? true;
  const includeCities = options.includeCities ?? true;
  const propertiesPage = options.propertiesPage ?? 1;
  const propertiesPageSize = options.propertiesPageSize ?? 1000;
  const propertiesSearch = options.propertiesSearch ?? "";
  const propertiesCity = options.propertiesCity ?? "";
  const propertiesSavedOnly = options.propertiesSavedOnly ?? false;
  const propertiesQueryKey = [
    ...propertiesBaseQueryKey,
    propertiesPage,
    propertiesPageSize,
    propertiesSearch,
    propertiesCity,
    propertiesSavedOnly,
  ];

  const userQuery = useQuery({
    queryKey: meQueryKey,
    queryFn: getCurrentUser,
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (token && userQuery.data) {
      setSession(token, userQuery.data);
    }
  }, [setSession, token, userQuery.data]);

  const propertiesQuery = useQuery({
    queryKey: propertiesQueryKey,
    queryFn: () =>
      getProperties({
        page: propertiesPage,
        pageSize: propertiesPageSize,
        search: propertiesSearch,
        city: propertiesCity || undefined,
        savedOnly: propertiesSavedOnly,
      }),
    enabled: Boolean(token) && includeProperties,
  });

  const favouritesQuery = useQuery({
    queryKey: favouritesQueryKey,
    queryFn: getFavourites,
    enabled: Boolean(token) && includeFavourites,
  });

  const propertyCitiesQuery = useQuery({
    queryKey: propertyCitiesQueryKey,
    queryFn: getPropertyCities,
    enabled: Boolean(token) && includeCities,
  });

  const favouriteMutation = useMutation({
    mutationFn: async (property: Property) => {
      if (property.isFavourite) {
        await removeFavourite(property.id);
        return {
          message: "Property removed from favourites.",
          severity: "error" as const,
        };
      }

      await addFavourite(property.id);
      return {
        message: "Property added to favourites.",
        severity: "success" as const,
      };
    },
    onMutate: (property) => {
      setBusyPropertyId(property.id);
    },
    onSuccess: async ({ message, severity }) => {
      showToast(message, severity);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: propertiesBaseQueryKey }),
        queryClient.invalidateQueries({ queryKey: favouritesQueryKey }),
      ]);
    },
    onError: (error) => {
      const details = normalizeAppError(
        error,
        "We could not update favourites. Please try again.",
      );
      showToast(details.message, "error");
    },
    onSettled: () => {
      setBusyPropertyId(null);
    },
  });

  const user = userQuery.data ?? storedUser;
  const properties = propertiesQuery.data?.properties ?? [];
  const favourites = favouritesQuery.data ?? [];
  const cities = propertyCitiesQuery.data ?? [];
  const averagePrice =
    properties.length > 0
      ? Math.round(
          properties.reduce((total, property) => total + property.price, 0) / properties.length,
        )
      : 0;

  const blockingUserError =
    userQuery.isError && !storedUser
      ? normalizeAppError(userQuery.error, "We could not load your account. Please try again.")
      : null;

  const userError = userQuery.isError
    ? normalizeAppError(userQuery.error, "We could not refresh your account details.")
    : null;

  const propertiesError = includeProperties && propertiesQuery.isError
    ? normalizeAppError(propertiesQuery.error, "We could not load the property catalogue.")
    : null;

  const favouritesError = includeFavourites && favouritesQuery.isError
    ? normalizeAppError(favouritesQuery.error, "We could not load your saved homes.")
    : null;

  return {
    token,
    user,
    storedUser,
    properties,
    propertiesPagination: propertiesQuery.data?.pagination ?? {
      page: propertiesPage,
      pageSize: propertiesPageSize,
      totalItems: 0,
      totalPages: 1,
    },
    favourites,
    cities,
    averagePrice,
    busyPropertyId,
    userQuery,
    propertiesQuery,
    favouritesQuery,
    propertyCitiesQuery,
    favouriteMutation,
    blockingUserError,
    userError,
    propertiesError,
    favouritesError,
    toggleFavourite: (property: Property) => favouriteMutation.mutate(property),
  };
};
