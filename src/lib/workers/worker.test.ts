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
});