# Connector run host (CVS-320)

The orchestrator that composes the connector layers into one server-side invocation:

```
secrets (CVS-141) → fetch runtime (CVS-142) → normalize (CVS-143)
    → bind/materialize (CVS-144) → metric_values, audited by CVS-145
```

Library: `src/shared/lib/connectors/host/` (SERVER-ONLY — reads decrypted secrets).
Entrypoint: `supabase/functions/connector-run` (Deno; reuses the library through the
function's `deno.json` import map + sloppy imports).

## Flow (`runConnectorStream`)

1. Load the `connected_accounts` row; only `connected`/`error` are runnable (`error`
   heals on a clean run; `revoked`/`pending` are rejected with a readable message).
2. Resolve the manifest + stream (CVS-140) and the normalizer (`getMapper`).
3. `resolveCredentials`: decrypt the secret; if the OAuth token is within 60s of
   expiry, refresh via the connector's registered `TokenRefresher` (`ga4` → Google),
   persist the rotated token *before* use, and log `connection_refreshed`. Failure
   → `markConnectionError` + `auth_failed` event + a payload-free `auth` summary.
4. Build the adapter from `ADAPTER_FACTORIES` (GA4 first; CVS-147+ register here).
5. `runStream` with `toRecordHandler(mapper, ctx, collectRecords().sink)` — canonical
   records are held in memory for the run only (locked decision CVS-137: no raw
   payloads persist).
6. Load enabled `metric_bindings` for the (account, stream); `materializeBinding`
   each and upsert `metric_values` (idempotent by `tracked_metric_id, period`).
   Malformed recipes are skipped and reported, never guessed at.
7. `recordRun` (CVS-145) + bump `last_synced_at` on success.

**Preview mode** (`preview: true`): capped fetch (default 10 records), in-memory
cursor, nothing persisted; the normalized sample is returned to the caller only.

## Tables (migration `20260711120000_connector_run_host.sql`)

| Table | Purpose | Write access |
| --- | --- | --- |
| `connector_cursors` | one opaque incremental cursor per (account, stream) | service role only (no client policies); workspace read |
| `metric_bindings` | persisted CVS-144 recipes: stream → tracked metric | workspace-scoped CRUD |

## Edge function

```
POST /functions/v1/connector-run
{ "account_id": "…", "stream": "page_metrics", "sync_mode?": "full_refresh",
  "preview?": true, "max_records?": 10 }
```

- **User JWT**: caller must be able to see the connected account under RLS
  ("Sync now"). The run itself uses the service role.
- **Service-role JWT**: trusted as-is (the CVS-323 scheduler / pg_cron path).

Function secrets: `CONNECTOR_SECRET_KEY` (required), `GOOGLE_OAUTH_CLIENT_ID` /
`GOOGLE_OAUTH_CLIENT_SECRET` (GA4 refresh). Deploy:
`npx supabase functions deploy connector-run`.

The function's `deno.json` maps `@/` → `src/`, pins `zod` + `@supabase/supabase-js`
to esm.sh, and enables `sloppy-imports` so the extensionless repo imports resolve
under Deno (verified with `deno run`; deploy bundling does not type-check).

## Adding a connector to the host

1. Register an adapter factory in `host/adapters.ts`.
2. OAuth connectors: register a `TokenRefresher` in `host/credentials.ts`.
3. Ensure the mapper key `connector:stream` matches the manifest stream name —
   `normalize.test.ts` has a regression test that cross-checks every key.
