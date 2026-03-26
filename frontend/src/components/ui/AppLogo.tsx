import { Box, Stack, Typography } from "@mui/material";
import homeNestLogo from "../../assets/images/home-nest.png";

type AppLogoProps = {
  subtitle?: string;
  showText?: boolean;
};

export const AppLogo = ({
  subtitle = "Smart buyer workspace",
  showText = true,
}: AppLogoProps) => {
  if (!showText) {
    return (
      <Box
        component="img"
        src={homeNestLogo}
        alt="HomeNest logo"
        sx={{
          width: { xs: 132, md: 168 },
          height: "auto",
          display: "block",
          objectFit: "contain",
        }}
      />
    );
  }

  return (
    <Stack spacing={2} alignItems="flex-start">
      <Box
        component="img"
        src={homeNestLogo}
        alt="HomeNest logo"
        sx={{
          width: { xs: 180, md: 240 },
          height: "auto",
          display: "block",
          objectFit: "contain",
        }}
      />
      <Stack spacing={0.25}>
        <Typography variant="h6" lineHeight={1.1}>
          HomeNest Portal
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Stack>
    </Stack>
  );
};
