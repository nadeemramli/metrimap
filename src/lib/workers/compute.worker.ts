// Web Worker for heavy computations using Comlink
import * as Comlink from 'comlink';
import { evaluate, create, all } from 'mathjs';
import * as ss from 'simple-statistics';
import type { MetricValue, MetricCard, Relationship } from '../types';

// Configure math.js for safe evaluation
const math = create(all);

// Types for computation functions
export interface ComputationWorker {
  // Formula Engine
  evaluateFormula: (formula: string, variables: Record<string, number>) => Promise<number>;
  validateFormula: (formula: string) => Promise<{ valid: boolean; error?: string }>;
  
  // Statistical Analysis
  calculateCorrelation: (data1: number[], data2: number[]) => Promise<number>;
  calculateCorrelationAnalysis: (data1: number[], data2: number[]) => Promise<{
    correlation: number;
    pValue: number;
    confidenceInterval: [number, number];
    sampleSize: number;
    isSignificant: boolean;
    effectSize: 'small' | 'medium' | 'large';
    powerAnalysis: {
      power: number;
      requiredSampleSize: number;
    };
  }>;
  calculateRegression: (data: Array<[number, number]>) => Promise<{ slope: number; intercept: number; r2: number }>;
  calculateMovingAverage: (data: number[], windowSize: number) => Promise<number[]>;
  calculateStatistics: (data: number[]) => Promise<{
    mean: number;
    median: number;
    std: number;
    min: number;
    max: number;
    variance: number;
  }>;
  
  // Metric Calculations
  processMetricData: (metricCards: MetricCard[]) => Promise<ProcessedMetricData[]>;
  calculateRelationshipStrength: (relationships: Relationship[], metricData: MetricCard[]) => Promise<RelationshipAnalysis[]>;
  
  // Large Dataset Operations
  processLargeDataset: (data: any[], operation: string) => Promise<any>;
}

export interface ProcessedMetricData {
  id: string;
  title: string;
  values: number[];
  trend: 'up' | 'down' | 'neutral';
  changePercent: number;
  statistics: {
    mean: number;
    median: number;
    std: number;
    variance: number;
  };
}

export interface RelationshipAnalysis {
  relationshipId: string;
  sourceId: string;
  targetId: string;
  correlationStrength: number;
  confidence: number;
  suggested: boolean;
}

// Implementation of computation functions
const computationWorker: ComputationWorker = {
  // Formula Engine
  async evaluateFormula(formula: string, variables: Record<string, number>): Promise<number> {
    try {
      // Create scope with variables
      const scope = { ...variables };
      
      // Evaluate the formula safely
      const result = math.evaluate(formula, scope);
      
      // Ensure we return a number
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return result;
      } else {
        throw new Error('Formula evaluation did not produce a valid number');
      }
    } catch (error) {
      console.error('Formula evaluation error:', error);
      throw error;
    }
  },

  async validateFormula(formula: string): Promise<{ valid: boolean; error?: string }> {
    try {
      // Try to parse the formula
      const node = math.parse(formula);
      
      // Check if it compiles to a valid expression
      const compiled = node.compile();
      
      // Test with dummy variables
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
  },

  // Statistical Analysis
  async calculateCorrelation(data1: number[], data2: number[]): Promise<number> {
    if (data1.length !== data2.length || data1.length < 2) {
      throw new Error('Data arrays must have the same length and at least 2 points');
    }
    
    try {
      return ss.sampleCorrelation(data1, data2);
    } catch (error) {
      console.error('Correlation calculation error:', error);
      return 0;
    }
  },

  // Enhanced correlation analysis with statistical significance
  async calculateCorrelationAnalysis(data1: number[], data2: number[]): Promise<{
    correlation: number;
    pValue: number;
    confidenceInterval: [number, number];
    sampleSize: number;
    isSignificant: boolean;
    effectSize: 'small' | 'medium' | 'large';
    powerAnalysis: {
      power: number;
      requiredSampleSize: number;
    };
  }> {
    if (data1.length !== data2.length || data1.length < 3) {
      throw new Error('Data arrays must have the same length and at least 3 points');
    }

    const n = data1.length;
    const correlation = ss.sampleCorrelation(data1, data2);
    
    // Calculate t-statistic for correlation
    const tStat = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation));
    
    // Calculate p-value using t-distribution (approximate)
    // For simplicity, using normal approximation for large samples
    const pValue = this.calculatePValue(tStat, n - 2);
    
    // Calculate confidence interval using Fisher transformation
    const fisherZ = 0.5 * Math.log((1 + correlation) / (1 - correlation));
    const se = 1 / Math.sqrt(n - 3);
    const zCritical = 1.96; // 95% confidence
    
    const lowerZ = fisherZ - zCritical * se;
    const upperZ = fisherZ + zCritical * se;
    
    const lowerCI = (Math.exp(2 * lowerZ) - 1) / (Math.exp(2 * lowerZ) + 1);
    const upperCI = (Math.exp(2 * upperZ) - 1) / (Math.exp(2 * upperZ) + 1);
    
    // Determine effect size (Cohen's conventions)
    const absCorr = Math.abs(correlation);
    let effectSize: 'small' | 'medium' | 'large';
    if (absCorr < 0.3) effectSize = 'small';
    else if (absCorr < 0.5) effectSize = 'medium';
    else effectSize = 'large';
    
    // Statistical significance (alpha = 0.05)
    const isSignificant = pValue < 0.05;
    
    // Power analysis (simplified)
    const power = this.calculatePower(correlation, n);
    const requiredSampleSize = this.calculateRequiredSampleSize(correlation, 0.8); // 80% power
    
    return {
      correlation,
      pValue,
      confidenceInterval: [lowerCI, upperCI],
      sampleSize: n,
      isSignificant,
      effectSize,
      powerAnalysis: {
        power,
        requiredSampleSize
      }
    };
  },

  // Helper function to calculate p-value (simplified)
  calculatePValue(tStat: number, df: number): number {
    // Simplified p-value calculation using normal approximation
    // For more accuracy, you'd want a proper t-distribution implementation
    const absT = Math.abs(tStat);
    
    // Very rough approximation for demonstration
    if (absT > 3.5) return 0.0001;
    if (absT > 2.58) return 0.01;
    if (absT > 1.96) return 0.05;
    if (absT > 1.645) return 0.1;
    return 0.2; // p > 0.1
  },

  // Simplified power calculation
  calculatePower(correlation: number, sampleSize: number): number {
    const effectSize = Math.abs(correlation);
    const z = Math.sqrt(sampleSize - 3) * 0.5 * Math.log((1 + effectSize) / (1 - effectSize));
    
    // Simplified power calculation
    if (z > 2.8) return 0.95;
    if (z > 2.3) return 0.8;
    if (z > 1.96) return 0.5;
    return 0.2;
  },

  // Calculate required sample size for given effect and power
  calculateRequiredSampleSize(correlation: number, desiredPower: number): number {
    const effectSize = Math.abs(correlation);
    if (effectSize < 0.1) return 500; // Very small effect
    if (effectSize < 0.3) return 100; // Small effect  
    if (effectSize < 0.5) return 30;  // Medium effect
    return 15; // Large effect
  },

  async calculateRegression(data: Array<[number, number]>): Promise<{ slope: number; intercept: number; r2: number }> {
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
  },

  async calculateMovingAverage(data: number[], windowSize: number): Promise<number[]> {
    if (windowSize <= 0 || windowSize > data.length) {
      throw new Error('Invalid window size');
    }
    
    const result: number[] = [];
    for (let i = windowSize - 1; i < data.length; i++) {
      const window = data.slice(i - windowSize + 1, i + 1);
      result.push(ss.mean(window));
    }
    
    return result;
  },

  async calculateStatistics(data: number[]): Promise<{
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
  },

  // Metric Calculations
  async processMetricData(metricCards: MetricCard[]): Promise<ProcessedMetricData[]> {
    const processed: ProcessedMetricData[] = [];
    
    for (const card of metricCards) {
      if (card.data && card.data.length > 0) {
        const values = card.data.map(d => d.value);
        const statistics = await computationWorker.calculateStatistics(values);
        
        // Calculate trend
        let trend: 'up' | 'down' | 'neutral' = 'neutral';
        let changePercent = 0;
        
        if (values.length >= 2) {
          const firstValue = values[0];
          const lastValue = values[values.length - 1];
          changePercent = ((lastValue - firstValue) / firstValue) * 100;
          
          if (Math.abs(changePercent) > 1) { // 1% threshold
            trend = changePercent > 0 ? 'up' : 'down';
          }
        }
        
        processed.push({
          id: card.id,
          title: card.title,
          values,
          trend,
          changePercent,
          statistics
        });
      }
    }
    
    return processed;
  },

  async calculateRelationshipStrength(relationships: Relationship[], metricData: MetricCard[]): Promise<RelationshipAnalysis[]> {
    const analysis: RelationshipAnalysis[] = [];
    
    for (const rel of relationships) {
      const sourceMetric = metricData.find(m => m.id === rel.sourceId);
      const targetMetric = metricData.find(m => m.id === rel.targetId);
      
      if (sourceMetric?.data && targetMetric?.data && 
          sourceMetric.data.length > 1 && targetMetric.data.length > 1) {
        
        // Extract values for correlation
        const sourceValues = sourceMetric.data.map(d => d.value);
        const targetValues = targetMetric.data.map(d => d.value);
        
        // Ensure equal length arrays
        const minLength = Math.min(sourceValues.length, targetValues.length);
        const sourceSlice = sourceValues.slice(0, minLength);
        const targetSlice = targetValues.slice(0, minLength);
        
        if (minLength >= 2) {
          try {
            const correlation = await computationWorker.calculateCorrelation(sourceSlice, targetSlice);
            
            // Calculate confidence based on correlation strength and sample size
            const correlationStrength = Math.abs(correlation);
            const sampleSizeBonus = Math.min(minLength / 10, 1); // Max 1, scaled by sample size
            const confidence = correlationStrength * sampleSizeBonus;
            
            analysis.push({
              relationshipId: rel.id,
              sourceId: rel.sourceId,
              targetId: rel.targetId,
              correlationStrength: correlation,
              confidence: confidence,
              suggested: correlationStrength > 0.3 && rel.confidence === 'Low' // Suggest upgrade if strong correlation
            });
          } catch (error) {
            console.warn(`Failed to calculate correlation for relationship ${rel.id}:`, error);
          }
        }
      }
    }
    
    return analysis;
  },

  // Large Dataset Operations
  async processLargeDataset(data: any[], operation: string): Promise<any> {
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
};

// Expose the worker API through Comlink
Comlink.expose(computationWorker);