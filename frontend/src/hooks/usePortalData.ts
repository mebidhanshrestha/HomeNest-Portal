import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { normalizeAppError } from "../lib/api";
import { addFavourite, getFavourites, removeFavourite } from "../services/favouriteService";
import { getCurrentUser } from "../services/authService";
import { getProperties } from "../services/propertyService";
import { useAuthStore } from "../stores/authStore";
import type { Property } from "../types";

const propertiesQueryKey = ["properties"];
const favouritesQueryKey = ["favourites"];
const meQueryKey = ["me"];

type PortalFeedback = {
  message: string;
  severity: "success" | "error";
} | null;

export const usePortalData = () => {
  const [feedback, setFeedback] = useState<PortalFeedback>(null);
  const [busyPropertyId, setBusyPropertyId] = useState<number | null>(null);
  const setSession = useAuthStore((state) => state.setSession);
  const token = useAuthStore((state) => state.token);
  const storedUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

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
    queryFn: getProperties,
    enabled: Boolean(token),
  });

  const favouritesQuery = useQuery({
    queryKey: favouritesQueryKey,
    queryFn: getFavourites,
    enabled: Boolean(token),
  });

  const favouriteMutation = useMutation({
    mutationFn: async (property: Property) => {
      if (property.isFavourite) {
        await removeFavourite(property.id);
        return "Property removed from favourites.";
      }

      await addFavourite(property.id);
      return "Property added to favourites.";
    },
    onMutate: (property) => {
      setBusyPropertyId(property.id);
    },
    onSuccess: async (message) => {
      setFeedback({ message, severity: "success" });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: propertiesQueryKey }),
        queryClient.invalidateQueries({ queryKey: favouritesQueryKey }),
      ]);
    },
    onError: (error) => {
      const details = normalizeAppError(
        error,
        "We could not update favourites. Please try again.",
      );
      setFeedback({ message: details.message, severity: "error" });
    },
    onSettled: () => {
      setBusyPropertyId(null);
    },
  });

  const user = userQuery.data ?? storedUser;
  const properties = propertiesQuery.data ?? [];
  const favourites = favouritesQuery.data ?? [];
  const cities = Array.from(new Set(properties.map((property) => property.city))).sort();
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

  const propertiesError = propertiesQuery.isError
    ? normalizeAppError(propertiesQuery.error, "We could not load the property catalogue.")
    : null;

  const favouritesError = favouritesQuery.isError
    ? normalizeAppError(favouritesQuery.error, "We could not load your saved homes.")
    : null;

  return {
    token,
    user,
    storedUser,
    properties,
    favourites,
    cities,
    averagePrice,
    feedback,
    busyPropertyId,
    userQuery,
    propertiesQuery,
    favouritesQuery,
    favouriteMutation,
    blockingUserError,
    userError,
    propertiesError,
    favouritesError,
    clearFeedback: () => setFeedback(null),
    toggleFavourite: (property: Property) => favouriteMutation.mutate(property),
  };
};
