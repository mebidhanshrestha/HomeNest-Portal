import type { ReactNode } from "react";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import { Breadcrumbs, Box, IconButton, Link, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type AppBreadcrumbsProps = {
  items: BreadcrumbItem[];
  actions?: ReactNode;
};

export const AppBreadcrumbs = ({ items, actions }: AppBreadcrumbsProps) => (
  <AppBreadcrumbsInner items={items} actions={actions} />
);

const AppBreadcrumbsInner = ({ items, actions }: AppBreadcrumbsProps) => {
  const navigate = useNavigate();

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      sx={(theme) => ({
        px: { xs: 1, md: 1.5 },
        py: 1,
        minHeight: 52,
        border: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.85),
        borderRadius: 1.5,
        backgroundColor: alpha(theme.palette.background.paper, 0.96),
      })}
    >
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 0 }}>
        <IconButton
          size="small"
          onClick={() => navigate(-1)}
          sx={{
            color: "text.secondary",
            mr: 0.25,
          }}
        >
          <ChevronLeftOutlinedIcon fontSize="small" />
        </IconButton>

        <Breadcrumbs
          separator={<NavigateNextOutlinedIcon sx={{ fontSize: 16, color: "text.disabled" }} />}
          aria-label="breadcrumb"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            if (isLast || !item.to) {
              return (
                <Typography
                  key={`${item.label}-${index}`}
                  variant="body2"
                  color={isLast ? "text.primary" : "text.secondary"}
                  fontWeight={isLast ? 500 : 400}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {item.label}
                </Typography>
              );
            }

            return (
              <Link
                key={`${item.label}-${index}`}
                component={RouterLink}
                to={item.to}
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: "0.875rem", fontWeight: 400, whiteSpace: "nowrap" }}
              >
                {item.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Stack>

      {actions ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "flex-start", sm: "flex-end" },
            gap: 1.25,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {actions}
        </Box>
      ) : null}
    </Stack>
  );
};
