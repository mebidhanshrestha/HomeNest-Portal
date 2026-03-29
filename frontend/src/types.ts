export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type Property = {
  id: number;
  title: string;
  city: string;
  price: number;
  imageUrl: string;
  createdAt: string;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  } | null;
  isFavourite?: boolean;
};

export type PropertyPagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type AuthResponse = {
  token: string;
  user: User;
};
