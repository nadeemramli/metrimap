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

  it("renders mock project cards", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText("SaaSCo Q3 Growth Model")).toBeDefined();
    expect(screen.getByText("User Retention Analytics")).toBeDefined();
  });
});
