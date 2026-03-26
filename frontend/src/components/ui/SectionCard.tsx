import type { PropsWithChildren, ReactNode } from "react";
import { Card, CardContent, Stack, Typography, type CardProps } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type SectionCardProps = PropsWithChildren<
  CardProps & {
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
  ...cardProps
}: SectionCardProps) => (
  <Card {...cardProps}>
    <CardContent
      sx={{ p: { xs: 2.5, md: 3 }, ...(contentSx as Record<string, unknown> | undefined) }}
    >
      <Stack spacing={3}>
        {title || description || action ? (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Stack spacing={0.5}>
              {title ? <Typography variant="h5">{title}</Typography> : null}
              {description ? (
                <Typography color="text.secondary">{description}</Typography>
              ) : null}
            </Stack>
            {action}
          </Stack>
        ) : null}
        {children}
      </Stack>
    </CardContent>
  </Card>
);
