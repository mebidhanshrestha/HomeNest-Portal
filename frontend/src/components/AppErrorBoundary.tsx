import type { ErrorInfo, PropsWithChildren } from "react";
import { Component } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { Box, Container, Stack } from "@mui/material";
import { AppButton } from "./ui/AppButton";
import { ErrorState } from "./ui/ErrorState";
import { SectionCard } from "./ui/SectionCard";

type AppErrorBoundaryState = {
  hasError: boolean;
};

class AppErrorBoundaryRoot extends Component<PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled frontend error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", py: 4 }}>
          <Container maxWidth="sm">
            <SectionCard>
              <ErrorState
                title="The app ran into an unexpected error"
                description="Please reload the page. If the problem continues, sign in again and retry the action."
                action={
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <AppButton
                      startIcon={<RefreshOutlinedIcon />}
                      onClick={() => window.location.reload()}
                    >
                      Reload page
                    </AppButton>
                    <AppButton
                      variant="outlined"
                      startIcon={<HomeOutlinedIcon />}
                      onClick={() => window.location.assign("/")}
                    >
                      Go to start
                    </AppButton>
                  </Stack>
                }
              />
            </SectionCard>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export const AppErrorBoundary = ({ children }: PropsWithChildren) => (
  <AppErrorBoundaryRoot>{children}</AppErrorBoundaryRoot>
);
