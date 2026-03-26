import type { PropsWithChildren, ReactNode } from "react";
import { Box, Stack, Typography, type BoxProps } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type SectionCardProps = PropsWithChildren<
  BoxProps & {
    title?: string;
    description?: string;
    action?: ReactNode;
    contentSx?: SxProps<Theme>;
  }
>;

export const SectionCard = ({
  title,
  description,
  action,
  children,
  contentSx,
  sx,
  ...boxProps
}: SectionCardProps) => (
  <Box
    {...boxProps}
    sx={[
      (theme) => ({
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }),
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    <Box
      sx={[
        { p: { xs: 2.5, md: 3 } },
        ...(Array.isArray(contentSx) ? contentSx : contentSx ? [contentSx] : []),
      ]}
    >
      <Stack spacing={3}>
        {title || description || action ? (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Stack spacing={0.5}>
              {title ? (
                <Typography variant="h6" fontWeight={600}>
                  {title}
                </Typography>
              ) : null}
              {description ? (
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              ) : null}
            </Stack>
            {action}
          </Stack>
        ) : null}
        {children}
      </Stack>
    </Box>
  </Box>
);
