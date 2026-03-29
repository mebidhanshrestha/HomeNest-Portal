import { Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { AppButton } from "../../components/ui/AppButton";
import { AppTextField } from "../../components/ui/AppTextField";
import type { PropertyPayload } from "../../services/propertyService";

export type PropertyFormValues = {
  title: string;
  city: string;
  price: string;
  imageUrl: string;
};

type PropertyFormProps = {
  defaultValues?: PropertyFormValues;
  submitLabel: string;
  isPending: boolean;
  onSubmit: (values: PropertyPayload) => void;
};

const emptyValues: PropertyFormValues = {
  title: "",
  city: "",
  price: "",
  imageUrl: "",
};

export const PropertyForm = ({
  defaultValues = emptyValues,
  submitLabel,
  isPending,
  onSubmit,
}: PropertyFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={handleSubmit((values) =>
        onSubmit({
          title: values.title.trim(),
          city: values.city.trim(),
          price: Number(values.price),
          imageUrl: values.imageUrl.trim(),
        }),
      )}
    >
      <AppTextField
        label="Title"
        error={Boolean(errors.title)}
        helperText={errors.title?.message}
        {...register("title", {
          validate: (value) => value.trim().length >= 2 || "Title must be at least 2 characters.",
        })}
      />
      <AppTextField
        label="City"
        error={Boolean(errors.city)}
        helperText={errors.city?.message}
        {...register("city", {
          validate: (value) => value.trim().length >= 2 || "City must be at least 2 characters.",
        })}
      />
      <AppTextField
        label="Price"
        type="number"
        error={Boolean(errors.price)}
        helperText={errors.price?.message}
        {...register("price", {
          validate: (value) => Number(value) > 0 || "Price must be greater than 0.",
        })}
      />
      <AppTextField
        label="Image URL"
        error={Boolean(errors.imageUrl)}
        helperText={errors.imageUrl?.message}
        {...register("imageUrl", {
          validate: (value) => {
            try {
              new URL(value.trim());
              return true;
            } catch {
              return "Enter a valid image URL.";
            }
          },
        })}
      />
      <AppButton type="submit" disabled={isPending}>
        {isPending ? "Saving..." : submitLabel}
      </AppButton>
    </Stack>
  );
};
