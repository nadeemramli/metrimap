# Connector observability (run health + audit)

Payload-free observability for native connectors (`src/shared/lib/connectors/observability/`,
CVS-145): records what each sync did — counts, cursor movement, error classes — and derives
an operator-facing health state, **without ever storing tokens or raw source payloads**.

Migration: `supabase/migrations/20260706130000_connector_runs.sql` (owner-applies, like CVS-141).

## The audit table (`connector_runs`)

Workspace-scoped, **append-only** (RLS: select + insert; no update/delete → immutable log).
Columns are payload-free by construction — counts (`pages`/`fetched`/`accepted`/`skipped`/
`rejected`/`materialized`), a `cursor` token, an `error_class`, a **redacted** `error_message`,
timings, and an `event` (`run_finished`/`run_failed` or connection lifecycle events). There is
deliberately **no** column for request bodies, tokens, or record contents.

## Recording

The CVS-142 `RunReport` is already payload-free; `recordRun(client, report, meta)` maps it to a
row and persists it. `runRowFromReport` computes `accepted` (`fetched − skipped − rejected`) and
`duration_ms`, and runs the message through `safeMessage` (redacts token-like runs +
`sk_`/`pk_`/`Bearer`/JWT prefixes, truncates to 300 chars) as defense-in-depth.

```ts
await recordRun(client, runReport, { connectedAccountId, workspaceId, materialized });
await recordConnectionEvent(client, { connectorId, connectedAccountId, event: 'connection_refreshed' });
```

`recordConnectionEvent` logs lifecycle events (connected / refreshed / revoked / disconnected /
auth_failed) — `auth_failed` is recorded as `status: error`.

## Reading + health

- `listRuns(client, { connectedAccountId?, connectorId?, limit })` — recent rows (safe columns),
  newest first, for the admin/debug panel.
- `latestRun(client, accountId, stream?)` — the most recent run event.
- `deriveHealth(latestRun, { connectionStatus, nowMs?, staleAfterMs? })` — pure. Connection state
  wins for hard stops (`revoked` → `needs_reconnect`, `paused` → `paused`); otherwise the last
  run decides:

  | last run | → health |
  | --- | --- |
  | error, `error_class: auth` | `needs_reconnect` |
  | error, `error_class: rate_limit` | `rate_limited` |
  | error/partial, other class | `failing` |
  | success, fresh | `healthy` |
  | success, older than `staleAfterMs` (default 24h) | `stale` |
  | no runs yet | `stale` (or `needs_reconnect` if the connection errored) |

This is the status Connected Accounts (CVS-90) and the admin panel surface.

## Retry safety

Retrying a failed run is safe: the fetch runtime only advances the cursor after a page is
fetched **and** handled (CVS-142), and metric binding upserts idempotently by
`(tracked_metric_id, period)` (CVS-144) — so a re-run neither skips data nor double-counts.

## Not here

No admin UI (backend contract only) and no full connection-event stream beyond the events above —
those render in the CVS-90 settings surface + a later admin/debug panel.
