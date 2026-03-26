import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { SectionCard } from "./SectionCard";

type StatCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
  tone?: "primary" | "secondary";
};

export const StatCard = ({
  label,
  value,
  helper,
  icon,
  tone = "primary",
}: StatCardProps) => (
  <SectionCard contentSx={{ p: 0 }}>
    <Stack spacing={2.5} sx={{ p: { xs: 2.5, md: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack spacing={0.75}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Stack>
        <Box
          sx={(theme) => ({
            width: 52,
            height: 52,
            display: "grid",
            placeItems: "center",
            borderRadius: 3,
            bgcolor: alpha(theme.palette[tone].main, 0.12),
            color: `${tone}.main`,
          })}
        >
          {icon}
        </Box>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {helper}
      </Typography>
    </Stack>
  </SectionCard>
);
