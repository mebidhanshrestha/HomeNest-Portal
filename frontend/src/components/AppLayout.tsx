import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useThemeStore } from "../stores/themeStore";
import homeNestLogo from "../assets/images/home-nest.png";
import homeNestIcon from "../assets/images/home-nest icon.png";
import { getAvatarColors } from "../lib/avatarColor";

const DRAWER_WIDTH = 260;
const COLLAPSED_DRAWER_WIDTH = 72;
const NAV_ITEM_HEIGHT = 48;

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <GridViewOutlinedIcon />,
    matches: (pathname: string) => pathname === "/dashboard",
  },
  {
    label: "Properties",
    path: "/dashboard/properties",
    icon: <HomeWorkOutlinedIcon />,
    matches: (pathname: string) => pathname.startsWith("/dashboard/properties"),
  },
  {
    label: "Saved",
    path: "/dashboard/saved",
    icon: <BookmarkBorderOutlinedIcon />,
    matches: (pathname: string) => pathname.startsWith("/dashboard/saved"),
  },
  {
    label: "Account",
    path: "/dashboard/account",
    icon: <PersonOutlineOutlinedIcon />,
    matches: (pathname: string) => pathname.startsWith("/dashboard/account"),
  },
];

export const AppLayout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isDesktop) {
      setMobileOpen(false);
      return;
    }
    setDesktopOpen(true);
  }, [isDesktop]);

  const activeItem =
    navigationItems.find((item) => item.matches(location.pathname)) ?? navigationItems[0];
  const drawerOpen = isDesktop ? desktopOpen : mobileOpen;
  const sidebarExpanded = isDesktop ? desktopOpen : true;

  const userInitial = useMemo(
    () => user?.name?.trim().charAt(0).toUpperCase() ?? "U",
    [user?.name],
  );
  const avatarColors = useMemo(
    () => getAvatarColors(user?.email ?? user?.name),
    [user?.email, user?.name],
  );

  const handleDrawerToggle = () => {
    if (isDesktop) {
      setDesktopOpen((current) => !current);
      return;
    }
    setMobileOpen((current) => !current);
  };

  const handleNavigationClose = () => {
    if (!isDesktop) {
      setMobileOpen(false);
    }
  };

  const handleProfileClose = () => {
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    handleProfileClose();
    clearSession();
    navigate("/auth", { replace: true });
  };

  const sidebarContent = (
    <Stack sx={{ height: "100%" }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          px: sidebarExpanded ? 2.5 : 1.5,
          py: 2,
          minHeight: 72,
          justifyContent: sidebarExpanded ? "space-between" : "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "relative",
          overflow: "visible",
        }}
      >
        <Box
          component="img"
          src={sidebarExpanded ? homeNestLogo : homeNestIcon}
          alt="HomeNest"
          sx={{
            width: sidebarExpanded ? 140 : 36,
            height: "auto",
            maxHeight: sidebarExpanded ? 40 : 36,
            objectFit: "contain",
            flexShrink: 0,
          }}
        />
      </Stack>

      <List sx={{ px: 1.25, py: 1.5, flexGrow: 1 }}>
        {navigationItems.map((item) => {
          const selected = item.matches(location.pathname);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={handleNavigationClose}
                selected={selected}
                sx={{
                  height: NAV_ITEM_HEIGHT,
                  px: sidebarExpanded ? 2 : 1.5,
                  justifyContent: sidebarExpanded ? "flex-start" : "center",
                  borderRadius: 2,
                  transition: "all 150ms ease",
                  "&.Mui-selected": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    width: sidebarExpanded ? 24 : 24,
                    mr: sidebarExpanded ? 2 : 0,
                    justifyContent: "center",
                    color: selected ? "primary.main" : "text.secondary",
                    transition: "color 150ms ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    display: sidebarExpanded ? "block" : "none",
                    opacity: sidebarExpanded ? 1 : 0,
                  }}
                  primaryTypographyProps={{
                    fontWeight: selected ? 600 : 500,
                    fontSize: "0.875rem",
                    color: selected ? "text.primary" : "text.secondary",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

    </Stack>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Drawer
        variant="temporary"
        open={!isDesktop && drawerOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open={isDesktop ? drawerOpen : false}
        sx={{
          display: { xs: "none", lg: "block" },
          width: desktopOpen ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
          flexShrink: 0,
          overflow: "visible",
          "& .MuiDrawer-paper": {
            width: desktopOpen ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            overflowX: "visible",
            overflowY: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {isDesktop ? (
        <IconButton
          onClick={handleDrawerToggle}
          size="small"
          sx={(theme) => ({
            position: "fixed",
            top: 36,
            left: (desktopOpen ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH) - 18,
            transform: "translateY(-50%)",
            color: "text.secondary",
            bgcolor: theme.palette.background.paper,
            width: 36,
            height: 36,
            border: "1px solid",
            borderColor: "divider",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 6px 16px rgba(15, 23, 42, 0.12)"
                : "0 10px 24px rgba(0, 0, 0, 0.34)",
            zIndex: theme.zIndex.drawer + 2,
            "&:hover": {
              bgcolor: alpha(theme.palette.background.paper, 0.96),
            },
          })}
        >
          {sidebarExpanded ? (
            <KeyboardArrowLeftOutlinedIcon fontSize="small" />
          ) : (
            <KeyboardArrowRightOutlinedIcon fontSize="small" />
          )}
        </IconButton>
      ) : null}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: { xs: 2, md: 3 },
            py: { xs: 1.5, md: 2 },
            minHeight: 72,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(8px)",
            position: "sticky",
            top: 0,
            zIndex: theme.zIndex.appBar,
          })}
        >
          {!isDesktop && (
            <IconButton
              aria-label="Open navigation"
              onClick={handleDrawerToggle}
              sx={{ color: "text.secondary" }}
            >
              <MenuOutlinedIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              noWrap
              fontWeight={600}
              color="text.primary"
            >
              {activeItem.label}
            </Typography>
          </Box>

          <IconButton
            ref={profileButtonRef}
            onClick={() => setProfileMenuOpen(true)}
            sx={{ p: 0.5 }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: avatarColors.bg,
                color: avatarColors.fg,
                fontSize: "0.875rem",
              }}
            >
              {userInitial}
            </Avatar>
          </IconButton>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>

      <Menu
        anchorEl={profileButtonRef.current}
        open={profileMenuOpen}
        onClose={handleProfileClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {user?.name ?? "Buyer"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email ?? "Signed in"}
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={(event) => event.stopPropagation()}
          sx={{ py: 1.25 }}
        >
          {mode === "light" ? (
            <DarkModeOutlinedIcon fontSize="small" sx={{ mr: 1.5, color: "text.secondary" }} />
          ) : (
            <LightModeOutlinedIcon fontSize="small" sx={{ mr: 1.5, color: "text.secondary" }} />
          )}
          <Typography sx={{ flexGrow: 1 }} variant="body2">
            Dark mode
          </Typography>
          <Switch
            size="small"
            checked={mode === "dark"}
            onChange={() => {
              toggleMode();
            }}
            onClick={(event) => event.stopPropagation()}
            sx={{ ml: 1.5, flexShrink: 0 }}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileClose();
            navigate("/dashboard/account");
          }}
          sx={{ py: 1.25 }}
        >
          <PersonOutlineOutlinedIcon fontSize="small" sx={{ mr: 1.5, color: "text.secondary" }} />
          <Typography variant="body2">Account settings</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 1.25 }}>
          <LogoutOutlinedIcon fontSize="small" sx={{ mr: 1.5, color: "text.secondary" }} />
          <Typography variant="body2">Sign out</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};
