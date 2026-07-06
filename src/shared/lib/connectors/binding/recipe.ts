// Aggregation engine (CVS-144): canonical records → value points. Pure + deterministic,
// so re-running the same records yields the same points (idempotent materialization).
import type { CanonicalRecord } from '../canonical';
import type { MetricRecipe, PeriodGrain, RecordFilter, ValuePoint } from './types';

/** ISO week label `YYYY-Www` (UTC), matching the day/month `slice` labels. */
function isoWeek(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (date.getUTCDay() + 6) % 7; // Mon=0
  date.setUTCDate(date.getUTCDate() - dayNum + 3); // nearest Thursday
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week =
    1 +
    Math.round(
      ((date.getTime() - firstThursday.getTime()) / 86_400_000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7
    );
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** Bucket an ISO timestamp into a period label for the grain. */
export function periodOf(occurredAt: string, grain: PeriodGrain): string {
  if (grain === 'day') return occurredAt.slice(0, 10);
  if (grain === 'month') return occurredAt.slice(0, 7);
  return isoWeek(new Date(occurredAt));
}

/** Resolve `amount`/`status` (envelope) or `attributes.<key>` on a record. */
function resolvePath(record: CanonicalRecord, path: string): unknown {
  if (path.startsWith('attributes.')) {
    return (record.attributes as Record<string, unknown> | undefined)?.[path.slice('attributes.'.length)];
  }
  return (record as unknown as Record<string, unknown>)[path];
}

function matchesFilter(record: CanonicalRecord, filter: RecordFilter): boolean {
  return resolvePath(record, filter.path) === filter.equals;
}

/** Aggregate records into one sorted value point per period. */
export function materialize(records: CanonicalRecord[], recipe: MetricRecipe): ValuePoint[] {
  const buckets = new Map<string, { sum: number; count: number }>();

  for (const r of records) {
    if (recipe.filter && !matchesFilter(r, recipe.filter)) continue;
    if (!r.occurred_at) continue;
    const period = periodOf(r.occurred_at, recipe.grain);
    const b = buckets.get(period) ?? { sum: 0, count: 0 };
    if (recipe.aggregation !== 'count') {
      const n = resolvePath(r, recipe.field ?? 'amount');
      if (typeof n === 'number' && Number.isFinite(n)) b.sum += n;
    }
    b.count += 1;
    buckets.set(period, b);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([period, b]) => ({
      period,
      value:
        recipe.aggregation === 'count'
          ? b.count
          : recipe.aggregation === 'average'
            ? b.count
              ? b.sum / b.count
              : 0
            : b.sum,
    }));
}
