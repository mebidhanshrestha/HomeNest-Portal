import Button, { type ButtonProps } from "@mui/material/Button";

export const AppButton = ({
  children,
  variant = "contained",
  size = "large",
  ...props
}: ButtonProps) => (
  <Button disableElevation variant={variant} size={size} {...props}>
    {children}
  </Button>
);
