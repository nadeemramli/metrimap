# Connector metric binding

The binding layer (`src/shared/lib/connectors/binding/`, CVS-144) turns validated
canonical records (CVS-139/143) into **tracked-metric values** — the bridge from a
connector stream to Metrimap's existing product model (`metric_values`, catalog, dashboards,
alerts). It's what the CVS-143 sink feeds.

## Concepts

- **`MetricBinding`** — "aggregate *this connector stream* into *this tracked metric* with
  *this recipe*": `{ connectorId, stream, canonicalSchema, recipe, targetTrackedMetricId,
  connectedAccountId? }`.
- **`MetricRecipe`** — `{ aggregation: 'sum'|'count'|'average', grain: 'day'|'week'|'month',
  field?, filter? }`. `field` is `amount` (envelope) or `attributes.<key>`; `filter` scopes
  which records count (e.g. only `succeeded` payments = revenue).
- **`materialize(records, recipe)`** — pure, deterministic aggregation into sorted
  `ValuePoint[]` (one value per period). Re-running the same records yields the same points.

## Materialization

`materializeBinding(records, binding, account?)` runs over a whole sync's accepted records
(aggregates span pages — use `collectRecords()` as the CVS-143 sink, then materialize at the
end) and returns:

- `status: 'materialized'` + `rows` (ready to upsert), or
- `status: 'stale' | 'orphaned'` with **no rows** when the backing connection is broken —
  freshness is derived from `connected_accounts.status` (`error` → stale, `revoked` →
  orphaned), so a broken source never writes silent zeroes.

Rows carry a compact **source-lineage token** in `metric_values.source`
(`connector=…;stream=…;recipe=…;schema=payment@1.0.0;account=…`).

## Persistence

`upsertMetricValues(client, rows)` upserts into `metric_values` **idempotent by
`(tracked_metric_id, period)`** — the same key the MCP push path uses — so re-syncing a
window replaces rather than double-counts. It runs under the caller's RLS (the user owns
the target tracked metric); the connector sync (CVS-146+) supplies the client.

## Preview

`previewBinding(sampleRecords, recipe)` computes the would-be points **without persisting** —
the "sample → map recipe → confirm" preview for source-backed metric creation.

## End-to-end shape (wired at CVS-146+)

```ts
const { records, sink } = collectRecords();
await runStream(adapter, stream, { /* … */, onRecords: toRecordHandler(mapper, ctx, sink) });
const result = materializeBinding(records, binding, account);
if (result.status === 'materialized') await upsertMetricValues(client, result.rows);
// else: surface stale/orphaned freshness in the UI instead of writing zeroes
```

## Not here

Full end-user mapping UI is out of scope (backend contracts + preview only). Ratio/active
recipes and multi-dimension keys are extension points on `MetricRecipe`; money values
aggregate in **minor units** (currency display is downstream).
