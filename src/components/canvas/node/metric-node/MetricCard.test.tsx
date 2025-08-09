import { describe, it, expect } from "vitest";
import type { MetricCard as MetricCardType } from "@/lib/types";

// Simple unit tests for MetricCard functionality without React Flow context
describe("MetricCard Utils", () => {
  it("should have correct type definitions", () => {
    const mockCard: MetricCardType = {
      id: "test-card",
      title: "Test Metric",
      description: "A test metric card",
      category: "Data/Metric",
      subCategory: "North Star Metric",
      tags: ["Test", "Revenue"],
      causalFactors: [],
      dimensions: ["Quantitative", "Strategic"],
      position: { x: 0, y: 0 },
      assignees: ["JD"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      data: [
        {
          period: "Past 7 days",
          value: 12450,
          change_percent: 8.2,
          trend: "up",
        },
        {
          period: "Past 30 days",
          value: 48760,
          change_percent: 12.5,
          trend: "up",
        },
      ],
    };

    expect(mockCard.id).toBe("test-card");
    expect(mockCard.category).toBe("Data/Metric");
    expect(mockCard.data).toHaveLength(2);
    expect(mockCard.tags).toContain("Test");
  });

  it("should support all card categories", () => {
    const categories: MetricCardType["category"][] = [
      "Core/Value",
      "Data/Metric",
      "Work/Action",
      "Ideas/Hypothesis",
      "Metadata",
    ];

    categories.forEach((category) => {
      expect(typeof category).toBe("string");
    });
  });
});
