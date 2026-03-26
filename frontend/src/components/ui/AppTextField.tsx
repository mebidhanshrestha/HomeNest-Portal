import TextField, { type TextFieldProps } from "@mui/material/TextField";

export const AppTextField = ({
  fullWidth = true,
  size = "medium",
  variant = "outlined",
  ...props
}: TextFieldProps) => (
  <TextField fullWidth size={size} variant={variant} {...props} />
);
