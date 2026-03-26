import {
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
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
  <Stack spacing={3.5}>
    <AppLogo subtitle="Simple, modern, and easy to use" />
    <Stack spacing={1.5}>
      <Typography
        variant="overline"
        color="primary.main"
        sx={{ letterSpacing: 1.5, fontWeight: 700 }}
      >
        Buyer Portal
      </Typography>
      <Typography variant="h2" sx={{ maxWidth: 560 }}>
        A cleaner property dashboard built around clarity.
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
        HomeNest keeps sign in, saved homes, and listing discovery in one calm interface with a
        limited color palette and clear actions.
      </Typography>
    </Stack>
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      <Chip icon={<InsightsOutlinedIcon />} label="Modern layout" />
      <Chip icon={<FavoriteBorderOutlinedIcon />} label="Saved homes at a glance" />
      <Chip icon={<ShieldOutlinedIcon />} label="Reusable MUI components" />
    </Stack>
    <SectionCard
      title="What changed"
      description="The UI now uses a small set of reusable Material UI components and a single theme source."
      variant="outlined"
    >
      <List disablePadding sx={{ display: "grid", gap: 1.5 }}>
        {highlights.map((highlight) => (
          <ListItem key={highlight.title} disableGutters sx={{ alignItems: "flex-start", py: 0 }}>
            <ListItemIcon
              sx={{
                minWidth: 40,
                mt: 0.25,
                color: "primary.main",
              }}
            >
              {highlight.icon}
            </ListItemIcon>
            <ListItemText
              primary={highlight.title}
              secondary={highlight.description}
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        ))}
      </List>
    </SectionCard>
  </Stack>
);
