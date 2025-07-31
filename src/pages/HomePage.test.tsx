import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("renders homepage title", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText("Metrimap")).toBeDefined();
    expect(
      screen.getByText("Visual business architecture mapping")
    ).toBeDefined();
  });

  it("renders new canvas button", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText("New Canvas")).toBeDefined();
  });

  it("renders empty state when no projects are loaded", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Test should expect empty state since auth fails in test environment
    expect(screen.getByText("No projects yet")).toBeDefined();
    expect(screen.getByText("Create your first canvas to start mapping your business architecture")).toBeDefined();
  });
});
