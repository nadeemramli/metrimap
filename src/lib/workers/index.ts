// Export worker functionality
export { workerManager } from './worker-manager';
export type { ComputationWorker, ProcessedMetricData, RelationshipAnalysis } from './compute.worker';
export {
  computeFormula,
  validateFormula,
  computeCorrelation,
  computeStatistics,
  analyzeMetrics,
  analyzeRelationships
} from './worker-manager';