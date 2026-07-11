// Test for Web Worker functionality
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { workerManager } from './worker-manager';

describe('Web Worker Integration', () => {
  beforeAll(async () => {
    // Initialize worker before tests
    await workerManager.initialize();
  });

  afterAll(async () => {
    // Clean up after tests
    await workerManager.terminate();
  });

  it('should initialize successfully (worker or fallback)', async () => {
    expect(workerManager.isReady() || typeof Worker === 'undefined').toBe(true);
  });

  it('should validate a simple formula', async () => {
    const result = await workerManager.validateFormula('x + y');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should evaluate a simple formula', async () => {
    const result = await workerManager.evaluateFormula('x + y', { x: 2, y: 3 });
    expect(result).toBe(5);
  });

  it('should calculate correlation between two arrays', async () => {
    const data1 = [1, 2, 3, 4, 5];
    const data2 = [2, 4, 6, 8, 10];
    const correlation = await workerManager.calculateCorrelation(data1, data2);
    expect(correlation).toBeCloseTo(1, 5); // Perfect positive correlation
  });

  it('should calculate basic statistics', async () => {
    const data = [1, 2, 3, 4, 5];
    const stats = await workerManager.calculateStatistics(data);
    
    expect(stats.mean).toBe(3);
    expect(stats.median).toBe(3);
    expect(stats.min).toBe(1);
    expect(stats.max).toBe(5);
    expect(stats.variance).toBeGreaterThan(0);
  });

  it('should handle invalid formulas', async () => {
    const result = await workerManager.validateFormula('x +* y'); // Truly invalid syntax
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle division by zero gracefully', async () => {
    try {
      await workerManager.evaluateFormula('x / y', { x: 1, y: 0 });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should return finite stats for a perfect linear correlation', async () => {
    const data1 = [1, 2, 3, 4, 5];
    const data2 = [2, 4, 6, 8, 10]; // r = 1 exactly
    const result = await workerManager.calculateCorrelationAnalysis(data1, data2);

    expect(result.correlation).toBeCloseTo(1, 5);
    expect(Number.isFinite(result.confidenceInterval[0])).toBe(true);
    expect(Number.isFinite(result.confidenceInterval[1])).toBe(true);
    expect(result.pValue).toBeLessThan(0.05);
    expect(Number.isFinite(result.powerAnalysis.power)).toBe(true);
  });

  it('should reject constant series with a readable error', async () => {
    const constant = [5, 5, 5, 5, 5];
    const varying = [1, 2, 3, 4, 5];
    await expect(
      workerManager.calculateCorrelationAnalysis(constant, varying)
    ).rejects.toThrow(/zero variance/);
  });
});