import type { ReactNode } from "react";
import { Stack, Typography } from "@mui/material";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
};

export const PageHeader = ({
  eyebrow,
  title,
  subtitle,
  actions,
}: PageHeaderProps) => (
  <Stack
    direction={{ xs: "column", lg: "row" }}
    spacing={2}
    justifyContent="space-between"
    alignItems={{ xs: "flex-start", lg: "flex-end" }}
  >
    <Stack spacing={1}>
      {eyebrow ? (
        <Typography
          variant="overline"
          color="primary.main"
          sx={{ letterSpacing: 1.4, fontWeight: 700 }}
        >
          {eyebrow}
        </Typography>
      ) : null}
      <Typography variant="h3">{title}</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
        {subtitle}
      </Typography>
    </Stack>
    {actions}
  </Stack>
);
