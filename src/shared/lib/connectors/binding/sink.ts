// Metric-value persistence (CVS-144). Upserts materialized rows into `metric_values`,
// idempotent by (tracked_metric_id, period) — the same key the MCP push path uses. Runs
// under the caller's RLS (the user owns the target tracked metric); the connector sync
// (CVS-146+) supplies the client.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import type { MetricValueRow } from './types';

/** Upsert materialized metric-value rows. Returns the number of rows written. */
export async function upsertMetricValues(
  client: SupabaseClient<Database>,
  rows: MetricValueRow[]
): Promise<number> {
  if (rows.length === 0) return 0;
  const { error } = await client
    .from('metric_values')
    .upsert(rows, { onConflict: 'tracked_metric_id,period' });
  if (error) throw new Error(error.message);
  return rows.length;
}
