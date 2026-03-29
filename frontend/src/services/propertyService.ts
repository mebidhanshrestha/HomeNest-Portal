import { api } from "../lib/api";
import type { Property, PropertyPagination } from "../types";

export type GetPropertiesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  city?: string;
  savedOnly?: boolean;
};

export type PaginatedPropertiesResponse = {
  success: boolean;
  message: string;
  data: {
    items: Property[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      total_pages: number;
    };
  };
};

export type NormalizedPropertiesList = {
  properties: Property[];
  pagination: PropertyPagination;
};

export const getProperties = async (
  params: GetPropertiesParams = {},
): Promise<NormalizedPropertiesList> => {
  const { data } = await api.get<
    | PaginatedPropertiesResponse
    | {
        properties: Property[];
      }
  >("/properties", {
    params,
  });

  if ("data" in data && typeof data.data === "object" && "items" in data.data) {
    return {
      properties: data.data.items,
      pagination: {
        page: data.data.pagination.page,
        pageSize: data.data.pagination.limit,
        totalItems: data.data.pagination.total,
        totalPages: data.data.pagination.total_pages,
      },
    };
  }

  const properties = "properties" in data ? data.properties ?? [] : [];

  return {
    properties,
    pagination: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? (properties.length || 1),
      totalItems: properties.length,
      totalPages: 1,
    },
  };
};

export const getPropertyCities = async () => {
  const { data } = await api.get<
    | {
        success: boolean;
        message: string;
        data: string[];
      }
    | {
        cities: string[];
      }
  >("/properties/cities");

  if ("data" in data) {
    return data.data;
  }

  return data.cities ?? [];
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
