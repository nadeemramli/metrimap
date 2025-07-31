import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Components
import AuthProvider from "./components/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ErrorBoundary } from "./components/error/ErrorBoundary";
import { CanvasHeaderProvider } from "./contexts/CanvasHeaderContext";

// Pages
import HomePage from "./pages/HomePage";
import CanvasLayout from "./components/layout/CanvasLayout";
import CanvasPage from "./pages/CanvasPage";
import DashboardPage from "./pages/DashboardPage";
import AssetsPage from "./pages/AssetsPage";
import SourcePage from "./pages/SourcePage";
import CanvasSettingsPage from "./pages/CanvasSettingsPage";
import EvidenceRepositoryPage from "./pages/EvidenceRepositoryPage";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Create a client
const queryClient = new QueryClient();

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Auth routes */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignupPage />} />
              <Route
                path="/auth/forgot-password"
                element={<ForgotPasswordPage />}
              />
              <Route
                path="/auth/reset-password"
                element={<ResetPasswordPage />}
              />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />

              {/* Evidence Repository */}
              <Route
                path="/evidence"
                element={
                  <ProtectedRoute>
                    <EvidenceRepositoryPage />
                  </ProtectedRoute>
                }
              />

              {/* Canvas routes - With sidebar layout */}
              <Route
                path="/canvas/:canvasId"
                element={
                  <ProtectedRoute>
                    <CanvasHeaderProvider>
                      <CanvasLayout />
                    </CanvasHeaderProvider>
                  </ProtectedRoute>
                }
              >
                <Route index element={<CanvasPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="assets" element={<AssetsPage />} />
                <Route path="evidence" element={<EvidenceRepositoryPage />} />
                <Route path="source" element={<SourcePage />} />
                <Route path="settings" element={<CanvasSettingsPage />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
