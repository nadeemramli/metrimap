// Metric binding (CVS-144): canonical records → tracked-metric values. Aggregation
// recipes, idempotent materialization with source lineage, connection-derived freshness,
// preview, and the metric_values upsert sink. See docs/data/connector-binding.md.
export * from './types';
export { materialize, periodOf } from './recipe';
export {
  materializeBinding,
  previewBinding,
  collectRecords,
  freshnessOf,
  lineageToken,
} from './materializeBinding';
export { upsertMetricValues } from './sink';
