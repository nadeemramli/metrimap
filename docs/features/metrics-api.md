# Metrics read/write API

Push and pull **Tracked Metric** values programmatically — Metrimap as a node in
your data pipeline. Backed by the `metrics-api` edge function (`verify_jwt` off;
auth is a workspace API key). All access is scoped to the key's workspace.

## Auth

Generate a key in **Workspace Settings → API keys**. The full key (`mk_live_…`) is
shown **once**; only its SHA-256 hash is stored (`public.api_keys`). Send it as a
header:

```
x-api-key: mk_live_xxxxxxxx…
```

Endpoint: `https://<project-ref>.functions.supabase.co/metrics-api`

## Read values

```bash
curl "https://<ref>.functions.supabase.co/metrics-api?metric=MRR" \
  -H "x-api-key: $METRIMAP_KEY"
# -> { "metric": { "id", "name", "unit" }, "values": [ { "period", "value", ... } ] }
```

`metric` accepts the Tracked Metric's **name** or its **uuid** (within the key's
workspace).

## Write values (upsert by period)

```bash
curl -X POST "https://<ref>.functions.supabase.co/metrics-api" \
  -H "x-api-key: $METRIMAP_KEY" -H "content-type: application/json" \
  -d '{ "metric": "MRR", "values": [ { "period": "2026-06", "value": 124000 } ] }'
# -> { "ok": true, "written": 1 }
```

Rows upsert on `(tracked_metric_id, period)` and are tagged `source: 'api'`. The
metric must already exist in the catalog (promote a card first).

## Notes / future

- The metric must be catalogued (a Tracked Metric); the API does not create
  metrics, only reads/writes their values.
- No rate limiting yet. Keys can be revoked anytime in Workspace Settings.
- Writes go through the value store, so they show on every canvas referencing
  the metric (shared series).
