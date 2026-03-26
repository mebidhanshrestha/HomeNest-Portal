import type { ReactNode } from "react";
import { Stack, Typography } from "@mui/material";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <Stack
    spacing={2}
    alignItems="center"
    textAlign="center"
    sx={{ py: 4, px: 2, maxWidth: 360, mx: "auto" }}
  >
    <Stack
      sx={(theme) => ({
        width: 64,
        height: 64,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        bgcolor:
          theme.palette.mode === "light"
            ? "rgba(47, 93, 115, 0.08)"
            : "rgba(244, 247, 248, 0.08)",
        color: "primary.main",
      })}
    >
      {icon}
    </Stack>
    <Stack spacing={0.75}>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Stack>
    {action}
  </Stack>
);
