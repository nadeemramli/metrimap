// Binding materialization (CVS-144): records + binding → idempotent metric-value rows,
// with source lineage and connection-derived freshness. A broken/revoked connection
// yields a stale/orphaned result — never a silent zero.
import { CANONICAL_SCHEMA_VERSION, type CanonicalRecord } from '../canonical';
import type { RecordSink } from '../normalize';
import { materialize } from './recipe';
import type { BindingFreshness, MaterializationResult, MetricBinding, MetricRecipe, ValuePoint } from './types';

/** Map a connection status to metric freshness. */
export function freshnessOf(status: string | undefined): BindingFreshness {
  if (status === 'revoked') return 'orphaned';
  if (status === 'error') return 'stale';
  return 'fresh'; // connected / pending / unknown → treat as fresh
}

/** Compact, human-scannable source-lineage token stored on each metric value. */
export function lineageToken(binding: MetricBinding): string {
  const parts = [
    `connector=${binding.connectorId}`,
    `stream=${binding.stream}`,
    `recipe=${binding.recipe.aggregation}`,
    `schema=${binding.canonicalSchema}@${CANONICAL_SCHEMA_VERSION}`,
  ];
  if (binding.connectedAccountId) parts.push(`account=${binding.connectedAccountId}`);
  return parts.join(';');
}

/**
 * Materialize a binding over the full accepted record set of a run. Idempotent: the
 * same records always produce the same rows, so upserting by (tracked_metric_id, period)
 * replaces rather than double-counts. If the backing connection is broken, returns a
 * `stale`/`orphaned` result with no rows (so a downstream sync never writes zeroes).
 */
export function materializeBinding(
  records: CanonicalRecord[],
  binding: MetricBinding,
  account?: { status: string }
): MaterializationResult {
  if (account) {
    const freshness = freshnessOf(account.status);
    if (freshness !== 'fresh') return { status: freshness, points: [], rows: [] };
  }
  const points = materialize(records, binding.recipe);
  const source = lineageToken(binding);
  const rows = points.map((p) => ({
    tracked_metric_id: binding.targetTrackedMetricId,
    period: p.period,
    value: p.value,
    source,
  }));
  return { status: 'materialized', points, rows };
}

/** Compute the value points for a sample without persisting — the source-backed-metric preview. */
export function previewBinding(records: CanonicalRecord[], recipe: MetricRecipe): ValuePoint[] {
  return materialize(records, recipe);
}

/**
 * A record sink that accumulates a run's accepted records so a binding can materialize
 * over the whole set at the end (aggregates span pages). Pair with the CVS-143
 * `toRecordHandler`, then call `materializeBinding(collected.records, binding)`.
 */
export function collectRecords(): { records: CanonicalRecord[]; sink: RecordSink } {
  const records: CanonicalRecord[] = [];
  return { records, sink: (recs) => { records.push(...recs); } };
}
