import { useRef, useState, type DragEvent } from "react";
import { Box, Stack, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import { alpha } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { AppButton } from "../../components/ui/AppButton";
import { AppTextField } from "../../components/ui/AppTextField";
import type { CreatePropertyPayload } from "../../services/propertyService";

type PropertyCreateFormValues = {
  title: string;
  city: string;
  price: string;
  image: FileList;
};

type PropertyCreateFormProps = {
  isPending: boolean;
  onSubmit: (values: CreatePropertyPayload) => void;
};

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const PropertyCreateForm = ({
  isPending,
  onSubmit,
}: PropertyCreateFormProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    watch,
  } = useForm<PropertyCreateFormValues>({
    defaultValues: {
      title: "",
      city: "",
      price: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const imageRegistration = register("image", {
    validate: (value) => value?.length > 0 || "Property image is required.",
  });
  const selectedImage = watch("image")?.[0];

  const assignImage = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!allowedTypes.has(file.type)) {
      setError("image", {
        type: "validate",
        message: "Upload a JPG, PNG, or WebP image.",
      });
      return;
    }

    const fileList = new DataTransfer();
    fileList.items.add(file);

    if (inputRef.current) {
      inputRef.current.files = fileList.files;
    }

    setValue("image", fileList.files, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    clearErrors("image");
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    assignImage(event.dataTransfer.files[0] ?? null);
  };

  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={handleSubmit((values) =>
        onSubmit({
          title: values.title.trim(),
          city: values.city.trim(),
          price: Number(values.price),
          image: values.image[0],
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

      <Box>
        <Box
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          sx={(theme) => ({
            p: 3,
            borderRadius: 2,
            border: "2px dashed",
            borderColor: errors.image
              ? theme.palette.error.main
              : isDragging
                ? theme.palette.primary.main
                : alpha(theme.palette.text.primary, 0.18),
            backgroundColor: isDragging
              ? alpha(theme.palette.primary.main, 0.06)
              : alpha(theme.palette.background.default, 0.4),
            cursor: "pointer",
            transition: "all 150ms ease",
          })}
        >
          <Stack spacing={1.25} alignItems="center" textAlign="center">
            {selectedImage ? (
              <InsertPhotoOutlinedIcon color="primary" />
            ) : (
              <CloudUploadOutlinedIcon color={isDragging ? "primary" : "action"} />
            )}
            <Typography fontWeight={600}>
              {selectedImage ? selectedImage.name : "Drag and drop an image here"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedImage
                ? "Click or drop another image to replace it."
                : "Or click to browse for a JPG, PNG, or WebP image up to 5 MB."}
            </Typography>
          </Stack>
        </Box>
        <Box
          component="input"
          type="file"
          sx={{ display: "none" }}
          accept="image/jpeg,image/png,image/webp"
          {...imageRegistration}
          ref={(element: HTMLInputElement | null) => {
            imageRegistration.ref(element);
            inputRef.current = element;
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            imageRegistration.onChange(event);
            assignImage(event.target.files?.[0] ?? null);
          }}
        />
        <Typography
          variant="body2"
          color={errors.image ? "error.main" : "text.secondary"}
          sx={{ mt: 1 }}
        >
          {errors.image?.message ?? "Upload a JPG, PNG, or WebP image up to 5 MB."}
        </Typography>
      </Box>

      <AppButton type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Create property"}
      </AppButton>
    </Stack>
  );
};
