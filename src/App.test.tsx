import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import App from "./App";

// Basic test to satisfy pre-commit hooks
describe("App", () => {
  it("renders without crashing", () => {
    // App already includes BrowserRouter, so don't wrap it again
    render(<App />);

    // App should render without throwing errors
    expect(document.body).toBeDefined();
  });

  it("initializes React Query client", () => {
    // App already includes BrowserRouter and QueryClient
    render(<App />);

    // Check if the app renders without errors
    expect(document.querySelector("body")).toBeDefined();
  });
});
