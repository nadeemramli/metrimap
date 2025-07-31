// React hook for using Web Workers in components
import { useState, useEffect, useCallback } from 'react';
import { workerManager } from '../workers/worker-manager';
import type { MetricCard, Relationship } from '../types';

interface UseWorkerState {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseWorkerResult extends UseWorkerState {
  // Formula operations
  evaluateFormula: (formula: string, variables: Record<string, number>) => Promise<number | null>;
  validateFormula: (formula: string) => Promise<{ valid: boolean; error?: string } | null>;
  
  // Statistical operations
  calculateCorrelation: (data1: number[], data2: number[]) => Promise<number | null>;
  analyzeCorrelation: (data1: number[], data2: number[]) => Promise<{
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
  } | null>;
  calculateStatistics: (data: number[]) => Promise<any | null>;
  
  // Metric analysis
  analyzeMetrics: (metricCards: MetricCard[]) => Promise<any[] | null>;
  analyzeRelationships: (relationships: Relationship[], metricData: MetricCard[]) => Promise<any[] | null>;
  
  // Utility
  clearError: () => void;
}

export const useWorker = (): UseWorkerResult => {
  const [state, setState] = useState<UseWorkerState>({
    isReady: false,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    // Check if worker is ready and update state
    const checkWorkerStatus = () => {
      setState(prev => ({
        ...prev,
        isReady: workerManager.isReady(),
      }));
    };

    // Initial check
    checkWorkerStatus();

    // Set up interval to check worker status
    const interval = setInterval(checkWorkerStatus, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await operation();
      setState(prev => ({ ...prev, isLoading: false }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      console.error('Worker operation failed:', error);
      return null;
    }
  }, []);

  const evaluateFormula = useCallback(async (
    formula: string, 
    variables: Record<string, number>
  ): Promise<number | null> => {
    return handleAsyncOperation(() => workerManager.evaluateFormula(formula, variables));
  }, [handleAsyncOperation]);

  const validateFormula = useCallback(async (
    formula: string
  ): Promise<{ valid: boolean; error?: string } | null> => {
    return handleAsyncOperation(() => workerManager.validateFormula(formula));
  }, [handleAsyncOperation]);

  const calculateCorrelation = useCallback(async (
    data1: number[], 
    data2: number[]
  ): Promise<number | null> => {
    return handleAsyncOperation(() => workerManager.calculateCorrelation(data1, data2));
  }, [handleAsyncOperation]);

  const analyzeCorrelation = useCallback(async (
    data1: number[], 
    data2: number[]
  ): Promise<{
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
  } | null> => {
    return handleAsyncOperation(() => workerManager.calculateCorrelationAnalysis(data1, data2));
  }, [handleAsyncOperation]);

  const calculateStatistics = useCallback(async (
    data: number[]
  ): Promise<any | null> => {
    return handleAsyncOperation(() => workerManager.calculateStatistics(data));
  }, [handleAsyncOperation]);

  const analyzeMetrics = useCallback(async (
    metricCards: MetricCard[]
  ): Promise<any[] | null> => {
    return handleAsyncOperation(() => workerManager.processMetricData(metricCards));
  }, [handleAsyncOperation]);

  const analyzeRelationships = useCallback(async (
    relationships: Relationship[], 
    metricData: MetricCard[]
  ): Promise<any[] | null> => {
    return handleAsyncOperation(() => 
      workerManager.calculateRelationshipStrength(relationships, metricData)
    );
  }, [handleAsyncOperation]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    isReady: state.isReady,
    isLoading: state.isLoading,
    error: state.error,
    evaluateFormula,
    validateFormula,
    calculateCorrelation,
    analyzeCorrelation,
    calculateStatistics,
    analyzeMetrics,
    analyzeRelationships,
    clearError,
  };
};