import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useThemeStore } from "../stores/themeStore";
import { AppButton } from "./ui/AppButton";
import { AppLogo } from "./ui/AppLogo";

const drawerWidth = 296;

const navigationItems = [
  {
    label: "Overview",
    description: "Summary and quick actions",
    path: "/dashboard",
    icon: <DashboardOutlinedIcon />,
    matches: (pathname: string) => pathname === "/dashboard" || pathname === "/dashboard/overview",
  },
  {
    label: "Listings",
    description: "Browse all properties",
    path: "/dashboard/listings",
    icon: <HomeOutlinedIcon />,
    matches: (pathname: string) => pathname.startsWith("/dashboard/listings"),
  },
  {
    label: "Saved Homes",
    description: "Manage your shortlist",
    path: "/dashboard/saved",
    icon: <TurnedInNotOutlinedIcon />,
    matches: (pathname: string) => pathname.startsWith("/dashboard/saved"),
  },
  {
    label: "Account",
    description: "Profile and preferences",
    path: "/dashboard/account",
    icon: <PersonOutlineOutlinedIcon />,
    matches: (pathname: string) => pathname.startsWith("/dashboard/account"),
  },
];

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const navigate = useNavigate();
  const location = useLocation();
  const activeItem =
    navigationItems.find((item) => item.matches(location.pathname)) ?? navigationItems[0];

  const drawerContent = (
    <Stack sx={{ height: "100%" }}>
      <Stack spacing={3} sx={{ px: 2.5, py: 3 }}>
        <AppLogo showText={false} />
        <Stack spacing={0.75}>
          <Typography variant="h6">Buyer workspace</Typography>
          <Typography color="text.secondary">
            Move between overview, listings, saved homes, and account pages from one place.
          </Typography>
        </Stack>
      </Stack>

      <List sx={{ px: 1.5, py: 0 }}>
        {navigationItems.map((item) => {
          const selected = item.matches(location.pathname);

          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              selected={selected}
              sx={{
                mb: 0.75,
                borderRadius: 3,
                alignItems: "flex-start",
                py: 1.5,
                px: 1.5,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": {
                    color: "inherit",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: selected ? "inherit" : "primary.main",
                  mt: 0.25,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.description}
                primaryTypographyProps={{ fontWeight: 700 }}
                secondaryTypographyProps={{
                  color: selected ? "rgba(255,255,255,0.72)" : "text.secondary",
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", px: 2.5, py: 3 }}>
        <Paper sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}>
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap>
                {user?.name ?? "Buyer"}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user?.email ?? "Signed in"}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            borderRight: "1px solid",
            borderColor: "divider",
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", lg: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            borderRight: "1px solid",
            borderColor: "divider",
            boxSizing: "border-box",
            bgcolor: "background.paper",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: "100vh",
          pb: { xs: 4, md: 6 },
        }}
      >
        <AppBar position="sticky">
          <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
            <Paper sx={{ px: { xs: 1.5, md: 2 }, py: 1 }}>
              <Toolbar disableGutters sx={{ gap: 2, minHeight: 72 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1, minWidth: 0 }}>
                  <IconButton
                    color="primary"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open navigation menu"
                    sx={{ display: { lg: "none" } }}
                  >
                    <MenuOutlinedIcon />
                  </IconButton>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h6" noWrap>
                      {activeItem.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {activeItem.description}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton color="primary" onClick={toggleMode} aria-label="Toggle theme mode">
                    {mode === "light" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                  </IconButton>

                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: "none", md: "block" } }}
                  />

                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ display: { xs: "none", md: "flex" }, minWidth: 0 }}
                  >
                    <Avatar sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}>
                      {user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" noWrap>
                        {user?.name ?? "Buyer"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {user?.email ?? "Signed in"}
                      </Typography>
                    </Box>
                  </Stack>

                  <AppButton
                    variant="outlined"
                    startIcon={<LogoutOutlinedIcon />}
                    onClick={() => {
                      clearSession();
                      navigate("/auth", { replace: true });
                    }}
                  >
                    Logout
                  </AppButton>
                </Stack>
              </Toolbar>
            </Paper>
          </Box>
        </AppBar>

        <Box sx={{ px: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
