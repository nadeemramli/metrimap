import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithClerk } from "../test-utils";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("renders homepage title", () => {
    renderWithClerk(<HomePage />);
    expect(screen.getByText("Metrimap")).toBeDefined();
  });

  it("renders new canvas button", () => {
    renderWithClerk(<HomePage />);
    expect(screen.getByText("New Canvas")).toBeDefined();
  });

  it("renders empty state when no projects are loaded", () => {
    renderWithClerk(<HomePage />);
    expect(screen.getByText("No projects yet")).toBeDefined();
    expect(
      screen.getByText(
        "Create your first canvas to start mapping your business architecture"
      )
    ).toBeDefined();
  });
});
