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
  isFavourite?: boolean;
};

export type AuthResponse = {
  token: string;
  user: User;
};
