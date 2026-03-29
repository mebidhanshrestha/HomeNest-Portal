import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

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
  <Box
    sx={(theme) => ({
      display: "flex",
      flexDirection: { xs: "column", lg: "row" },
      alignItems: { xs: "flex-start", lg: "center" },
      justifyContent: "space-between",
      gap: 2.5,
      px: { xs: 2.5, md: 4 },
      py: { xs: 2.5, md: 3.5 },
      borderRadius: 4,
      border: "1px solid",
      borderColor: "divider",
      backgroundColor: alpha(theme.palette.background.paper, 0.92),
      boxShadow:
        theme.palette.mode === "light"
          ? "0 12px 28px rgba(24, 29, 41, 0.05)"
          : "0 18px 32px rgba(0, 0, 0, 0.24)",
      animation: "shell-rise 560ms cubic-bezier(0.22, 1, 0.36, 1) both",
    })}
  >
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      {eyebrow ? (
        <Typography
          variant="overline"
          color="primary.main"
          sx={{ letterSpacing: 1.8, fontWeight: 800 }}
        >
          {eyebrow}
        </Typography>
      ) : null}
      <Typography variant="h3" sx={{ fontSize: { xs: "2rem", md: "3.15rem" } }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
        {subtitle}
      </Typography>
    </Stack>
    {actions ? (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "flex-start", lg: "flex-end" },
          flexWrap: "wrap",
          gap: 1.5,
          minWidth: { lg: 180 },
        }}
      >
        {actions}
      </Box>
    ) : null}
  </Box>
);
