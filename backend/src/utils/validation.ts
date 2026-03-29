import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
    .regex(/[a-z]/, "Password must include at least one lowercase letter.")
    .regex(/[0-9]/, "Password must include at least one number."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .regex(/[A-Z]/, "New password must include at least one uppercase letter.")
      .regex(/[a-z]/, "New password must include at least one lowercase letter.")
      .regex(/[0-9]/, "New password must include at least one number."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, "Reset token is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .regex(/[A-Z]/, "New password must include at least one uppercase letter.")
      .regex(/[a-z]/, "New password must include at least one lowercase letter.")
      .regex(/[0-9]/, "New password must include at least one number."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

export const favouriteSchema = z.object({
  propertyId: z.coerce.number().int().positive("Select a valid property."),
});

export const createPropertySchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  city: z.string().trim().min(2, "City must be at least 2 characters."),
  price: z.coerce.number().int().positive("Price must be greater than 0."),
});

export const propertySchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  city: z.string().trim().min(2, "City must be at least 2 characters."),
  price: z.coerce.number().int().positive("Price must be greater than 0."),
  imageUrl: z.string().trim().url("Enter a valid image URL."),
});

export const propertyParamsSchema = z.object({
  id: z.coerce.number().int().positive("Select a valid property."),
});
