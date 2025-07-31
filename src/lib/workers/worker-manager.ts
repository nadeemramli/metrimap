// Worker Manager for handling Web Worker lifecycle and communication
import * as Comlink from 'comlink';
import type { ComputationWorker } from './compute.worker';
import { evaluate, create, all } from 'mathjs';
import * as ss from 'simple-statistics';

// Configure math.js for fallback mode
const math = create(all);

class WorkerManager {
  private worker: Worker | null = null;
  private computeApi: Comlink.Remote<ComputationWorker> | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Check if we're in a browser environment
    if (typeof Worker === 'undefined') {
      console.warn('Web Workers are not available in this environment. Computations will run on the main thread.');
      this.isInitialized = true;
      return;
    }

    try {
      // Create the worker - Vite will handle the worker URL
      this.worker = new Worker(
        new URL('./compute.worker.ts', import.meta.url),
        { type: 'module' }
      );

      // Wrap with Comlink
      this.computeApi = Comlink.wrap<ComputationWorker>(this.worker);
      this.isInitialized = true;

      console.log('Computation worker initialized successfully');
    } catch (error) {
      console.error('Failed to initialize computation worker:', error);
      throw error;
    }
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.computeApi = null;
      this.isInitialized = false;
      console.log('Computation worker terminated');
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  // Fallback implementations for when Worker is not available
  private async fallbackEvaluateFormula(formula: string, variables: Record<string, number>): Promise<number> {
    try {
      const scope = { ...variables };
      const result = math.evaluate(formula, scope);
      
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return result;
      } else {
        throw new Error('Formula evaluation did not produce a valid number');
      }
    } catch (error) {
      console.error('Formula evaluation error:', error);
      throw error;
    }
  }

  private async fallbackValidateFormula(formula: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const node = math.parse(formula);
      const compiled = node.compile();
      
      try {
        compiled.evaluate({ x: 1, y: 2, z: 3 });
      } catch (evalError) {
        // If it fails with dummy variables, it might need specific ones
        // This is still a valid formula, just needs proper variables
      }
      
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Invalid formula' 
      };
    }
  }

  private async fallbackCalculateCorrelation(data1: number[], data2: number[]): Promise<number> {
    if (data1.length !== data2.length || data1.length < 2) {
      throw new Error('Data arrays must have the same length and at least 2 points');
    }
    
    try {
      return ss.sampleCorrelation(data1, data2);
    } catch (error) {
      console.error('Correlation calculation error:', error);
      return 0;
    }
  }

  private async fallbackCalculateStatistics(data: number[]): Promise<{
    mean: number;
    median: number;
    std: number;
    min: number;
    max: number;
    variance: number;
  }> {
    if (data.length === 0) {
      throw new Error('Cannot calculate statistics for empty data');
    }
    
    return {
      mean: ss.mean(data),
      median: ss.median(data),
      std: ss.standardDeviation(data),
      min: ss.min(data),
      max: ss.max(data),
      variance: ss.variance(data)
    };
  }

  // Formula Engine Methods
  async evaluateFormula(formula: string, variables: Record<string, number>): Promise<number> {
    await this.ensureInitialized();
    if (!this.computeApi) {
      // Fallback to main thread
      return this.fallbackEvaluateFormula(formula, variables);
    }
    return this.computeApi.evaluateFormula(formula, variables);
  }

  async validateFormula(formula: string): Promise<{ valid: boolean; error?: string }> {
    await this.ensureInitialized();
    if (!this.computeApi) {
      // Fallback to main thread
      return this.fallbackValidateFormula(formula);
    }
    return this.computeApi.validateFormula(formula);
  }

  // Statistical Analysis Methods
  async calculateCorrelation(data1: number[], data2: number[]): Promise<number> {
    await this.ensureInitialized();
    if (!this.computeApi) {
      // Fallback to main thread
      return this.fallbackCalculateCorrelation(data1, data2);
    }
    return this.computeApi.calculateCorrelation(data1, data2);
  }

  async calculateRegression(data: Array<[number, number]>): Promise<{ slope: number; intercept: number; r2: number }> {
    await this.ensureInitialized();
    if (!this.computeApi) {
      // Fallback to main thread (simple implementation)
      if (data.length < 2) {
        throw new Error('Need at least 2 data points for regression');
      }
      
      try {
        const regression = ss.linearRegression(data);
        const r2 = ss.rSquared(data, regression);
        
        return {
          slope: regression.m,
          intercept: regression.b,
          r2: r2
        };
      } catch (error) {
        console.error('Regression calculation error:', error);
        throw error;
      }
    }
    return this.computeApi.calculateRegression(data);
  }

  async calculateMovingAverage(data: number[], windowSize: number): Promise<number[]> {
    await this.ensureInitialized();
    if (!this.computeApi) {
      // Fallback to main thread
      if (windowSize <= 0 || windowSize > data.length) {
        throw new Error('Invalid window size');
      }
      
      const result: number[] = [];
      for (let i = windowSize - 1; i < data.length; i++) {
        const window = data.slice(i - windowSize + 1, i + 1);
        result.push(ss.mean(window));
      }
      
      return result;
    }
    return this.computeApi.calculateMovingAverage(data, windowSize);
  }

  async calculateStatistics(data: number[]): Promise<{
    mean: number;
    median: number;
    std: number;
    min: number;
    max: number;
    variance: number;
  }> {
    await this.ensureInitialized();
    if (!this.computeApi) {
      // Fallback to main thread
      return this.fallbackCalculateStatistics(data);
    }
    return this.computeApi.calculateStatistics(data);
  }

  // Metric Analysis Methods
  async processMetricData(metricCards: any[]): Promise<any[]> {
    await this.ensureInitialized();
    if (!this.computeApi) {
      // Fallback to main thread (simplified implementation)
      return metricCards.filter(card => card.data && card.data.length > 0).map(card => ({
        id: card.id,
        title: card.title,
        values: card.data.map((d: any) => d.value),
        trend: 'neutral' as const,
        changePercent: 0,
        statistics: {
          mean: 0,
          median: 0,
          std: 0,
          variance: 0
        }
      }));
    }
    return this.computeApi.processMetricData(metricCards);
  }

  async calculateRelationshipStrength(relationships: any[], metricData: any[]): Promise<any[]> {
    await this.ensureInitialized();
    if (!this.computeApi) {
      // Fallback to main thread (simplified implementation)
      return relationships.map(rel => ({
        relationshipId: rel.id,
        sourceId: rel.sourceId,
        targetId: rel.targetId,
        correlationStrength: 0,
        confidence: 0,
        suggested: false
      }));
    }
    return this.computeApi.calculateRelationshipStrength(relationships, metricData);
  }

  // Large Dataset Operations
  async processLargeDataset(data: any[], operation: string): Promise<any> {
    await this.ensureInitialized();
    if (!this.computeApi) {
      // Fallback to main thread
      switch (operation) {
        case 'sum':
          return data.reduce((sum, item) => sum + (typeof item === 'number' ? item : 0), 0);
        
        case 'average':
          const numbers = data.filter(item => typeof item === 'number');
          return numbers.length > 0 ? numbers.reduce((sum, num) => sum + num, 0) / numbers.length : 0;
        
        case 'group':
          return data.reduce((groups, item) => {
            const key = item.category || 'uncategorized';
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
            return groups;
          }, {} as Record<string, any[]>);
        
        case 'sort':
          return [...data].sort((a, b) => {
            if (typeof a === 'number' && typeof b === 'number') {
              return a - b;
            }
            return String(a).localeCompare(String(b));
          });
        
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    }
    return this.computeApi.processLargeDataset(data, operation);
  }

  // Utility method to check if worker is ready
  isReady(): boolean {
    return this.isInitialized;
  }
}

// Create a singleton instance
export const workerManager = new WorkerManager();

// Helper functions for common operations
export const computeFormula = async (formula: string, variables: Record<string, number>): Promise<number> => {
  return workerManager.evaluateFormula(formula, variables);
};

export const validateFormula = async (formula: string): Promise<{ valid: boolean; error?: string }> => {
  return workerManager.validateFormula(formula);
};

export const computeCorrelation = async (data1: number[], data2: number[]): Promise<number> => {
  return workerManager.calculateCorrelation(data1, data2);
};

export const computeStatistics = async (data: number[]) => {
  return workerManager.calculateStatistics(data);
};

export const analyzeMetrics = async (metricCards: any[]) => {
  return workerManager.processMetricData(metricCards);
};

export const analyzeRelationships = async (relationships: any[], metricData: any[]) => {
  return workerManager.calculateRelationshipStrength(relationships, metricData);
};

// Initialize worker on module load
workerManager.initialize().catch(console.error);

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    workerManager.terminate();
  });
}