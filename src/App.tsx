import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignedOut, SignUp, SignedIn } from "@clerk/react-router";
import { Navigate } from "react-router-dom";

// Components
import ClerkSupabaseProvider from "./components/auth/ClerkSupabaseProvider";
import DevAuthProvider from "./components/auth/DevAuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ErrorBoundary } from "./components/error/ErrorBoundary";
import { CanvasHeaderProvider } from "./lib/contexts/CanvasHeaderContext";
import { AuthenticatedSupabaseProvider } from "./lib/contexts/AuthenticatedSupabaseContext";

// Pages
import HomePage from "./pages/homepage/HomePage";
import CanvasLayout from "./components/layout/CanvasLayout";
import CanvasPage from "./pages/canvas/CanvasPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AssetsPage from "./pages/asset/AssetsPage";
import SourcePage from "./pages/source/SourcePage";
import CanvasSettingsPage from "./pages/canvas/CanvasSettingsPage";
import EvidenceRepositoryPage from "./pages/evidence/EvidenceRepositoryPage";
import EvidencePage from "./pages/evidence/EvidencePage";
import ExcalidrawTestPage from "./pages/ExcalidrawTestPage";

// Auth Pages
import SignInPage from "./pages/auth/SignInPage";

// Create a client
const queryClient = new QueryClient();

// Check if we're in development mode (using local Supabase)
import { isDevelopmentEnvironment } from "@/lib/supabase/client";
import XStateCanvasDemo from "@/components/canvas/XStateCanvasDemo";
const isDevelopment = isDevelopmentEnvironment();

export default function App() {
  console.log("App component rendering");
  console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
  console.log("isDevelopment:", isDevelopment);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {isDevelopment ? (
          // Development mode - use DevAuthProvider
          <DevAuthProvider>
            <AuthenticatedSupabaseProvider>
              <Routes>
                {/* Development routes - no auth required */}
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/debug"
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
                        <p className="mb-4">Development mode is active!</p>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>✅ App component rendered</p>
                          <p>✅ Development auth provider loaded</p>
                          <p>✅ Local Supabase connected</p>
                          <p>✅ No Clerk authentication required</p>
                        </div>
                      </div>
                    </div>
                  }
                />
                <Route path="/evidence" element={<EvidenceRepositoryPage />} />
                <Route
                  path="/evidence/:evidenceId"
                  element={<EvidencePage />}
                />
                <Route
                  path="/excalidraw-test"
                  element={<ExcalidrawTestPage />}
                />
                <Route
                  path="/canvas/:canvasId"
                  element={
                    <CanvasHeaderProvider>
                      <CanvasLayout />
                    </CanvasHeaderProvider>
                  }
                >
                  <Route index element={<CanvasPage />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="assets" element={<AssetsPage />} />
                  <Route path="evidence" element={<EvidenceRepositoryPage />} />
                  <Route
                    path="evidence/:evidenceId"
                    element={<EvidencePage />}
                  />
                  <Route path="source" element={<SourcePage />} />
                  <Route path="settings" element={<CanvasSettingsPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthenticatedSupabaseProvider>
          </DevAuthProvider>
        ) : (
          // Production mode - use Clerk authentication
          <ClerkSupabaseProvider>
            <AuthenticatedSupabaseProvider>
              <Routes>
                {/* Auth routes with Clerk */}
                <Route
                  path="/auth/sign-in"
                  element={
                    <>
                      <SignedOut>
                        <SignInPage />
                      </SignedOut>
                      <SignedIn>
                        <Navigate to="/" replace />
                      </SignedIn>
                    </>
                  }
                />
                <Route
                  path="/auth/sign-up"
                  element={
                    <>
                      <SignedOut>
                        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
                          <SignUp />
                        </div>
                      </SignedOut>
                      <SignedIn>
                        <Navigate to="/" replace />
                      </SignedIn>
                    </>
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
                <Route
                  path="/evidence/:evidenceId"
                  element={
                    <ProtectedRoute>
                      <EvidencePage />
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
                  <Route
                    path="evidence/:evidenceId"
                    element={<EvidencePage />}
                  />
                  <Route path="source" element={<SourcePage />} />
                  <Route path="settings" element={<CanvasSettingsPage />} />

                  {/* Development-only routes */}
                  {isDevelopment && (
                    <Route path="xstate-demo" element={<XStateCanvasDemo />} />
                  )}
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
            </AuthenticatedSupabaseProvider>
          </ClerkSupabaseProvider>
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
