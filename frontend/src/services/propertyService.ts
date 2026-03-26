import { api } from "../lib/api";
import type { Property } from "../types";

export const getProperties = async () => {
  const { data } = await api.get<{ properties: Property[] }>("/properties");
  return data.properties;
};
