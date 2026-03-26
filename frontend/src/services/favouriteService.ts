import { api } from "../lib/api";
import type { Property } from "../types";

export const getFavourites = async () => {
  const { data } = await api.get<{ favourites: Property[] }>("/favourites");
  return data.favourites;
};

export const addFavourite = async (propertyId: number) => {
  await api.post("/favourites", { propertyId });
};

export const removeFavourite = async (propertyId: number) => {
  await api.delete(`/favourites/${propertyId}`);
};
