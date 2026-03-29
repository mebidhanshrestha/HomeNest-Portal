import { api } from "../lib/api";
import type { Property } from "../types";

export const getProperties = async () => {
  const { data } = await api.get<{ properties: Property[] }>("/properties");
  return data.properties;
};

export type PropertyPayload = {
  title: string;
  city: string;
  price: number;
  imageUrl: string;
};

export type CreatePropertyPayload = {
  title: string;
  city: string;
  price: number;
  image: File;
};

export const getProperty = async (id: number) => {
  const { data } = await api.get<{ property: Property }>(`/properties/${id}`);
  return data.property;
};

export const createProperty = async (payload: CreatePropertyPayload) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("city", payload.city);
  formData.append("price", payload.price.toString());
  formData.append("image", payload.image);

  const { data } = await api.post<{ property: Property }>("/properties", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.property;
};

export const updateProperty = async (id: number, payload: PropertyPayload) => {
  const { data } = await api.put<{ property: Property }>(`/properties/${id}`, payload);
  return data.property;
};

export const deleteProperty = async (id: number) => {
  await api.delete(`/properties/${id}`);
};
