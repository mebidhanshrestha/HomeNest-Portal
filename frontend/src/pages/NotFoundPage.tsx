import ExploreOffOutlinedIcon from "@mui/icons-material/ExploreOffOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import { Box, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppButton } from "../components/ui/AppButton";
import { ErrorState } from "../components/ui/ErrorState";
import { SectionCard } from "../components/ui/SectionCard";
import { useAuthStore } from "../stores/authStore";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", py: 4 }}>
      <Container maxWidth="sm">
        <SectionCard>
          <ErrorState
            icon={<ExploreOffOutlinedIcon />}
            title="Page not found"
            description="The page you tried to open does not exist or is no longer available."
            action={
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <AppButton
                  startIcon={<HomeOutlinedIcon />}
                  onClick={() => navigate(token ? "/dashboard" : "/", { replace: true })}
                >
                  {token ? "Go to dashboard" : "Go to home"}
                </AppButton>
                {!token ? (
                  <AppButton
                    variant="outlined"
                    startIcon={<LoginOutlinedIcon />}
                    onClick={() => navigate("/auth", { replace: true })}
                  >
                    Go to login
                  </AppButton>
                ) : null}
              </Stack>
            }
          />
        </SectionCard>
      </Container>
    </Box>
  );
};
