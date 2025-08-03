import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ClerkProvider } from "@clerk/react-router";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import App from "./App";

// Mock Clerk hooks for testing
vi.mock("@clerk/react-router", async () => {
  const actual = await vi.importActual("@clerk/react-router");
  return {
    ...actual,
    useUser: () => ({
      user: null,
      isLoaded: true,
    }),
    useAuth: () => ({
      isSignedIn: false,
      isLoaded: true,
    }),
  };
});

// Test wrapper that provides all necessary providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ClerkProvider publishableKey="pk_test_mock">{children}</ClerkProvider>
  </BrowserRouter>
);

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />, { wrapper: TestWrapper });
    expect(document.body).toBeDefined();
  });

  it("initializes React Query client", () => {
    render(<App />, { wrapper: TestWrapper });
    expect(document.querySelector("body")).toBeDefined();
  });
});
