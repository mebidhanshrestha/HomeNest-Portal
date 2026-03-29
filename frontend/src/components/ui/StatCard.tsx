import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { SectionCard } from "./SectionCard";

type StatCardProps = {
  label: string;
  value: ReactNode;
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
  <SectionCard
    contentSx={{ p: 0 }}
    sx={{
      height: "100%",
    }}
  >
    <Stack spacing={2} sx={{ p: { xs: 2.5, md: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack spacing={0.5}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ letterSpacing: 0.8, fontWeight: 600, fontSize: "0.7rem" }}
          >
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={600} sx={{ lineHeight: 1.2 }}>
            {value}
          </Typography>
        </Stack>
        <Box
          sx={(theme) => ({
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            bgcolor: alpha(theme.palette[tone].main, 0.1),
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
