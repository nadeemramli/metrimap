import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import HomePage from "./pages/HomePage";
import CanvasLayout from "./components/layout/CanvasLayout";
import CanvasPage from "./pages/CanvasPage";
import DashboardPage from "./pages/DashboardPage";
import AssetsPage from "./pages/AssetsPage";
import SourcePage from "./pages/SourcePage";
import CanvasSettingsPage from "./pages/CanvasSettingsPage";

// Create a client
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Homepage - No sidebar */}
          <Route path="/" element={<HomePage />} />
          
          {/* Canvas routes - With sidebar layout */}
          <Route path="/canvas/:canvasId" element={<CanvasLayout />}>
            <Route index element={<CanvasPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="source" element={<SourcePage />} />
            <Route path="settings" element={<CanvasSettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
