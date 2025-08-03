import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignedOut, SignUp } from "@clerk/react-router";
import { Navigate } from "react-router-dom";

// Components
import ClerkSupabaseProvider from "./components/auth/ClerkSupabaseProvider";
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
import SignInPage from "./pages/SignInPage";

// Create a client
const queryClient = new QueryClient();

export default function App() {
  console.log("App component rendering");

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ClerkSupabaseProvider>
          <Routes>
            {/* Auth routes with Clerk */}
            <Route
              path="/auth/sign-in"
              element={
                <SignedOut>
                  <SignInPage />
                </SignedOut>
              }
            />
            <Route
              path="/auth/sign-up"
              element={
                <SignedOut>
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
                    <SignUp />
                  </div>
                </SignedOut>
              }
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

            {/* Debug route - always accessible */}
            <Route
              path="/debug"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
                    <p className="mb-4">
                      If you can see this, the app is working!
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>✅ App component rendered</p>
                      <p>✅ Clerk provider loaded</p>
                      <p>✅ Routing is working</p>
                    </div>
                  </div>
                </div>
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

            {/* Catch-all route for unauthenticated users */}
            <Route
              path="*"
              element={
                <SignedOut>
                  <Navigate to="/auth/sign-in" replace />
                </SignedOut>
              }
            />
          </Routes>
        </ClerkSupabaseProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
