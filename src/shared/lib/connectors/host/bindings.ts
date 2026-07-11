// Persisted metric bindings (CVS-320). Loads `metric_bindings` rows into the CVS-144
// MetricBinding shape so the run host can materialize a stream's records into every
// bound tracked metric. Rows with a malformed recipe are skipped (payload-free warning
// left to the caller's run report), never guessed at — silently-wrong numbers are worse
// than missing ones.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import type { Aggregation, MetricBinding, MetricRecipe, PeriodGrain } from '../binding';

type Client = SupabaseClient<Database>;

const AGGREGATIONS: readonly Aggregation[] = ['sum', 'count', 'average'];
const GRAINS: readonly PeriodGrain[] = ['day', 'week', 'month'];

/** Parse a `recipe` jsonb value into a MetricRecipe, or undefined if malformed. */
export function parseRecipe(value: unknown): MetricRecipe | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const r = value as Record<string, unknown>;
  if (!AGGREGATIONS.includes(r.aggregation as Aggregation)) return undefined;
  if (!GRAINS.includes(r.grain as PeriodGrain)) return undefined;
  const recipe: MetricRecipe = {
    aggregation: r.aggregation as Aggregation,
    grain: r.grain as PeriodGrain,
  };
  if (typeof r.field === 'string') recipe.field = r.field;
  if (typeof r.filter === 'object' && r.filter !== null) {
    const f = r.filter as Record<string, unknown>;
    if (typeof f.path === 'string' && ['string', 'number', 'boolean'].includes(typeof f.equals)) {
      recipe.filter = { path: f.path, equals: f.equals as string | number | boolean };
    }
  }
  return recipe;
}

export interface LoadedBindings {
  bindings: MetricBinding[];
  /** Ids of rows whose recipe failed to parse — surfaced payload-free, never executed. */
  malformedIds: string[];
}

/** Enabled bindings for one connected account + stream, as CVS-144 MetricBindings. */
export async function loadBindings(client: Client, accountId: string, stream: string): Promise<LoadedBindings> {
  const { data, error } = await client
    .from('metric_bindings')
    .select('id, connector_id, stream, canonical_schema, recipe, tracked_metric_id, connected_account_id')
    .eq('connected_account_id', accountId)
    .eq('stream', stream)
    .eq('enabled', true);
  if (error) throw new Error(error.message);

  const bindings: MetricBinding[] = [];
  const malformedIds: string[] = [];
  for (const row of data ?? []) {
    const recipe = parseRecipe(row.recipe);
    if (!recipe) {
      malformedIds.push(row.id);
      continue;
    }
    bindings.push({
      connectorId: row.connector_id,
      stream: row.stream,
      canonicalSchema: row.canonical_schema,
      recipe,
      targetTrackedMetricId: row.tracked_metric_id,
      connectedAccountId: row.connected_account_id,
    });
  }
  return { bindings, malformedIds };
}
