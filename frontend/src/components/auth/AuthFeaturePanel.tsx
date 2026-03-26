import {
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { AppLogo } from "../ui/AppLogo";
import { SectionCard } from "../ui/SectionCard";

const highlights = [
  {
    icon: <TuneOutlinedIcon fontSize="small" />,
    title: "Focused workflow",
    description: "Log in, review listings, and manage saved homes without extra noise.",
  },
  {
    icon: <FavoriteBorderOutlinedIcon fontSize="small" />,
    title: "Clear shortlist tracking",
    description: "Keep favourite homes in one place with simple actions and visible status.",
  },
  {
    icon: <ShieldOutlinedIcon fontSize="small" />,
    title: "Consistent Material UI system",
    description: "Shared buttons, inputs, and cards make the experience easier to maintain.",
  },
];

export const AuthFeaturePanel = () => (
  <Stack spacing={4} sx={{ animation: "shell-rise 520ms cubic-bezier(0.22, 1, 0.36, 1) both" }}>
    <AppLogo subtitle="Simple, modern, and easy to use" />
    <Stack spacing={1.5}>
      <Typography
        variant="overline"
        color="primary.main"
        sx={{ letterSpacing: 1.8, fontWeight: 800 }}
      >
        Buyer Portal
      </Typography>
      <Typography variant="h2" sx={{ maxWidth: 560 }}>
        Find, compare, and save homes in one calm workspace.
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
        HomeNest now uses the same restrained shell language as your Class Schedular reference:
        a quiet workspace, one strong accent color, and clear actions.
      </Typography>
    </Stack>
    <SectionCard
      title="What you can do here"
      description="Everything important is visible at a glance before you even sign in."
      sx={(theme) => ({
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
      })}
    >
      <Stack spacing={1.5}>
        {highlights.map((highlight) => (
          <Stack
            key={highlight.title}
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: "flex-start",
            }}
          >
            <Stack
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                mt: 0.25,
                color: "primary.main",
                bgcolor: "rgba(255,255,255,0.7)",
              }}
            >
              {highlight.icon}
            </Stack>
            <Stack spacing={0.4}>
              <Typography fontWeight={700}>{highlight.title}</Typography>
              <Typography color="text.secondary">{highlight.description}</Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </SectionCard>
  </Stack>
);
