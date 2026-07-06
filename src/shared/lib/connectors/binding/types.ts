// Metric-binding contracts (CVS-144): turn canonical records (CVS-139/143) into
// tracked-metric values. A binding says "aggregate this connector stream's records
// into this metric with this recipe"; materialization produces idempotent value
// points with source lineage. See docs/data/connector-binding.md.

/** Time bucket for a metric series. */
export type PeriodGrain = 'day' | 'week' | 'month';

/** How records collapse into one value per period. */
export type Aggregation = 'sum' | 'count' | 'average';

/** Match a record field to a value (e.g. only `succeeded` payments count as revenue). */
export interface RecordFilter {
  /** `amount` / `status` (envelope) or `attributes.<key>`. */
  path: string;
  equals: string | number | boolean;
}

/** Aggregation recipe: what to compute, over which grain, on which field, filtered how. */
export interface MetricRecipe {
  aggregation: Aggregation;
  grain: PeriodGrain;
  /** Numeric to aggregate for sum/average: `amount` or `attributes.<key>` (ignored for count). */
  field?: string;
  filter?: RecordFilter;
}

/** A binding from a connector stream to a target tracked metric. */
export interface MetricBinding {
  connectorId: string;
  stream: string;
  canonicalSchema: string;
  recipe: MetricRecipe;
  targetTrackedMetricId: string;
  /** The connected account backing this binding (drives freshness/stale). */
  connectedAccountId?: string;
}

/** One aggregated point of a metric series. */
export interface ValuePoint {
  period: string;
  value: number;
}

/** A row ready to upsert into `metric_values` (idempotent by tracked_metric_id+period). */
export interface MetricValueRow {
  tracked_metric_id: string;
  period: string;
  value: number;
  /** Compact source-lineage token (connector/stream/recipe/normalizer). */
  source: string;
}

/** Freshness derived from the backing connection's status — never a silent zero. */
export type BindingFreshness = 'fresh' | 'stale' | 'orphaned';

export interface MaterializationResult {
  /** `materialized` = points produced; `stale`/`orphaned` = connection broken, nothing written. */
  status: 'materialized' | BindingFreshness;
  points: ValuePoint[];
  rows: MetricValueRow[];
}
