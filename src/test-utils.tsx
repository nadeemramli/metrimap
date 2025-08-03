import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react-router";
import { vi } from "vitest";

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

// Mock Clerk for testing - BrowserRouter must be outside ClerkProvider
const mockClerkProvider = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ClerkProvider publishableKey="pk_test_mock">{children}</ClerkProvider>
  </BrowserRouter>
);

// Custom render function that includes Clerk provider
export const renderWithClerk = (ui: React.ReactElement) => {
  return render(ui, { wrapper: mockClerkProvider });
};
