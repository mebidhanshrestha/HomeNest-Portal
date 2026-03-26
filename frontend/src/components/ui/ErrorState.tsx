import type { ReactNode } from "react";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { Stack, Typography } from "@mui/material";

type ErrorStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export const ErrorState = ({
  title,
  description,
  action,
  icon = <ReportProblemOutlinedIcon />,
}: ErrorStateProps) => (
  <Stack
    spacing={2}
    alignItems="center"
    textAlign="center"
    sx={{ py: 4, px: 2, maxWidth: 420, mx: "auto" }}
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
            ? "rgba(216, 132, 98, 0.12)"
            : "rgba(216, 132, 98, 0.18)",
        color: "secondary.main",
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
