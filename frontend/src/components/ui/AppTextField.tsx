import { forwardRef } from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

export const AppTextField = forwardRef<HTMLInputElement, TextFieldProps>(function AppTextField(
  {
    fullWidth = true,
    size = "medium",
    variant = "outlined",
    ...props
  },
  ref,
) {
  return <TextField fullWidth size={size} variant={variant} inputRef={ref} {...props} />;
});
