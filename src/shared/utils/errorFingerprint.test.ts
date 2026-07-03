import { describe, it, expect } from "vitest";
import { computeErrorFingerprint, normalizeRoute } from "./errorFingerprint";

const base = {
  message: "Cannot read properties of undefined (reading 'name')",
  errorStack:
    "TypeError: Cannot read properties of undefined\n    at MetricCard (https://app.example.com/assets/index-a1b2c3d4.js:120:15)\n    at div",
  componentStack: "\n    at MetricCard\n    at DashboardPage",
  pathname: "/canvas/1234",
};

describe("computeErrorFingerprint", () => {
  it("is deterministic for the same crash", async () => {
    const a = await computeErrorFingerprint(base);
    const b = await computeErrorFingerprint(base);
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{16}$/);
  });

  it("groups the same crash across deploys (different bundle hash) and dynamic route ids", async () => {
    const redeployed = {
      ...base,
      errorStack: base.errorStack.replace("index-a1b2c3d4.js:120:15", "index-9f8e7d6c.js:118:9"),
      pathname: "/canvas/98765", // different id, same route shape
    };
    expect(await computeErrorFingerprint(redeployed)).toBe(
      await computeErrorFingerprint(base)
    );
  });

  it("separates different error messages", async () => {
    const other = { ...base, message: "Network request failed" };
    expect(await computeErrorFingerprint(other)).not.toBe(
      await computeErrorFingerprint(base)
    );
  });

  it("separates different routes", async () => {
    const other = { ...base, pathname: "/settings" };
    expect(await computeErrorFingerprint(other)).not.toBe(
      await computeErrorFingerprint(base)
    );
  });

  it("still fingerprints when component stack / stack are missing", async () => {
    const fp = await computeErrorFingerprint({
      message: "boom",
      errorStack: null,
      componentStack: null,
      pathname: "/",
    });
    expect(fp).toMatch(/^[0-9a-f]{16}$/);
  });
});

describe("normalizeRoute", () => {
  it("collapses uuid and numeric segments to :id and drops query", () => {
    expect(normalizeRoute("/canvas/123/card/9f8e7d6c-1111-2222-3333-444455556666?tab=data")).toBe(
      "/canvas/:id/card/:id"
    );
    expect(normalizeRoute(undefined)).toBe("/");
  });
});
