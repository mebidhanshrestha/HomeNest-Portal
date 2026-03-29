import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { AppToast } from "./components/ui/AppToast";
import { AuthPage } from "./pages/AuthPage";
import { AccountPage } from "./pages/AccountPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { PropertyCreatePage } from "./modules/properties/PropertyCreatePage";
import { PropertyDetailPage } from "./modules/properties/PropertyDetailPage";
import { PropertyEditPage } from "./modules/properties/PropertyEditPage";
import { PropertyListPage } from "./modules/properties/PropertyListPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SavedHomesPage } from "./pages/SavedHomesPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";
import { useAuthStore } from "./stores/authStore";
import { useThemeStore } from "./stores/themeStore";
import { createAppTheme } from "./theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

function App() {
  const mode = useThemeStore((state) => state.mode);
  const token = useAuthStore((state) => state.token);
  const theme = createAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppToast />
      <AppErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={<Navigate to={token ? "/dashboard" : "/auth"} replace />}
              />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
              <Route path="/auth/reset" element={<ResetPasswordPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="properties" element={<PropertyListPage />} />
                <Route path="properties/new" element={<PropertyCreatePage />} />
                <Route path="properties/:id" element={<PropertyDetailPage />} />
                <Route path="properties/:id/edit" element={<PropertyEditPage />} />
                <Route path="saved" element={<SavedHomesPage />} />
                <Route path="account" element={<AccountPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </AppErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
