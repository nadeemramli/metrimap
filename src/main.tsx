import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/react-router";
import "./index.css";
import App from "./App.tsx";
import UserbackInitializer from "./components/feedback/UserbackInitializer";
import DevUserbackInitializer from "./components/feedback/DevUserbackInitializer";
import { isDevelopmentEnvironment } from "@/lib/supabase/client";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log("Clerk Publishable Key:", PUBLISHABLE_KEY ? "Set" : "Not set");

if (!PUBLISHABLE_KEY) {
  console.error(
    "Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file"
  );
  // Instead of throwing, let's show a helpful error page
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "system-ui, sans-serif",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div>
          <h1>🚨 Configuration Error</h1>
          <p>Missing Clerk Publishable Key</p>
          <p>
            Please add <code>VITE_CLERK_PUBLISHABLE_KEY</code> to your .env file
          </p>
          <p>
            Get your key from the{" "}
            <a
              href="https://dashboard.clerk.com"
              target="_blank"
              rel="noopener"
            >
              Clerk Dashboard
            </a>
          </p>
        </div>
      </div>
    </StrictMode>
  );
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        {isDevelopmentEnvironment() ? (
          <DevUserbackInitializer />
        ) : (
          <UserbackInitializer />
        )}
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
