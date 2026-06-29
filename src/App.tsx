import { SignedIn, SignedOut, SignUp } from '@clerk/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Navigate, Route, Routes } from 'react-router-dom';

// Components
import ClerkSupabaseProvider from './features/auth/components/ClerkSupabaseProvider';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import { ErrorBoundary } from './shared/components/common/error/ErrorBoundary';
import { ConfirmDialogProvider } from './shared/components/ConfirmDialog';
import { Toaster } from './shared/components/ui/sonner';
import { AuthenticatedSupabaseProvider } from './shared/contexts/AuthenticatedSupabaseContext';
import { CanvasHeaderProvider } from './shared/contexts/CanvasHeaderContext';

// Pages
import AssetsPage from './features/assets/pages/AssetsPage';
import CanvasLayout from './features/canvas/components/CanvasLayout';
import CanvasPage from './features/canvas/pages/CanvasPage';
import CanvasSettingsPage from './features/canvas/pages/CanvasSettingsPage';
import EnhancedCanvasPage from './features/canvas/pages/EnhancedCanvasPage';

import DashboardPage from './features/dashboard/pages/DashboardPage';
import EvidencePage from './features/evidence/pages/EvidencePage';
import EvidenceRepositoryPage from './features/evidence/pages/EvidenceRepositoryPage';
import CatalogPage from './features/catalog/pages/CatalogPage';
import FeedPage from './features/notifications/pages/FeedPage';
import WorkspaceSettingsPage from './features/settings/pages/WorkspaceSettingsPage';
import EmbedCanvasPage from './features/canvas/pages/EmbedCanvasPage';
import HomePage from './features/projects/pages/HomePage';
import SourcePage from './features/sources/pages/SourcePage';

// Auth Pages
import SignInPage from './features/auth/pages/SignInPage';

// Create a client
const queryClient = new QueryClient();

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        themes={['light', 'dark', 'night', 'system']}
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <ClerkSupabaseProvider>
            <AuthenticatedSupabaseProvider>
              <ConfirmDialogProvider>
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

                {/* Public read-only embed (no auth — RLS gates by is_public) */}
                <Route path="/embed/:canvasId" element={<EmbedCanvasPage />} />

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
                <Route
                  path="/catalog"
                  element={
                    <ProtectedRoute>
                      <CatalogPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/feed"
                  element={
                    <ProtectedRoute>
                      <FeedPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/workspace"
                  element={
                    <ProtectedRoute>
                      <WorkspaceSettingsPage />
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
                  <Route path="enhanced" element={<EnhancedCanvasPage />} />
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
                  {/* TODO: Re-add XStateCanvasDemo when component is recreated */}
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
              <Toaster richColors closeButton position="bottom-right" />
              </ConfirmDialogProvider>
            </AuthenticatedSupabaseProvider>
          </ClerkSupabaseProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
