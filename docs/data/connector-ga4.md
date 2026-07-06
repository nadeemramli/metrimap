# GA4 connector

The first native connector (`src/shared/lib/connectors/adapters/ga4/`, CVS-146): Google
Analytics 4 via the **Data API**, over the shared runtime. Proves the end-to-end path
fetch → normalize → bind for an analytics source.

## Pieces

- **`oauth.ts`** — Google OAuth 2.0 auth-code flow (`access_type=offline` → refresh token),
  scope **`analytics.readonly`** (least privilege). `buildGoogleAuthUrl` starts the connect;
  `exchangeGoogleCode` / `refreshGoogleToken` get + refresh tokens. Client id/secret come from
  server env `GOOGLE_OAUTH_CLIENT_ID` / `GOOGLE_OAUTH_CLIENT_SECRET` (**owner setup: CVS-280**).
  Returned tokens are stored encrypted via the connection layer (CVS-141).
- **`adapter.ts`** — `createGa4Adapter({ propertyId })` returns a CVS-142 `ConnectorAdapter`.
  `fetchPage` POSTs a `runReport` (dimensions/metrics from the manifest stream), classifies
  HTTP errors (401/403 → `auth`, 429 → `rate_limit`, 5xx → `transient`) so the runtime retries
  correctly, paginates by `offset`, and advances the incremental cursor by max `date`.

Credentials are **injected** by the runtime per run — the adapter never reads secrets.

## Streams (match the CVS-140 GA4 manifest + CVS-143 mappers)

| stream | dimensions → metrics | canonical | mapper key |
| --- | --- | --- | --- |
| `page_metrics` | `date, pagePath` → `screenPageViews, sessions` | `page_metric` | `ga4:page_metrics` |
| `events` | `date, eventName` → `eventCount` | `analytics_event` | `ga4:events` |

`page_metrics` flattens to **one row per metric** (2 metrics → 2 `page_metric` records per
page/day); `events` flattens to one row per event.

## Live wiring (once CVS-280 is done)

```ts
// OAuth callback (edge fn): exchange code → store encrypted tokens (CVS-141)
const tokens = await exchangeGoogleCode({ code, clientId, clientSecret, redirectUri });
await storeAccountSecret(service, accountId, tokens, CONNECTOR_SECRET_KEY, { sourceAccountId: propertyId });

// Sync: resolve token → run stream → normalize → bind → observe
const secret = await readAccountSecret(service, accountId, CONNECTOR_SECRET_KEY);
const adapter = createGa4Adapter({ propertyId });
const { records, sink } = collectRecords();
const report = await runStream(adapter, stream, {
  credentials: { access_token: secret.accessToken }, syncMode: 'incremental',
  cursorStore, cursorKey: cursorKeyFor(accountId, 'ga4', stream.name),
  onRecords: toRecordHandler(getMapper('ga4', stream.name)!, ctx, sink),
});
const bound = materializeBinding(records, binding, account);
if (bound.status === 'materialized') await upsertMetricValues(client, bound.rows);
await recordRun(client, report, { connectedAccountId: accountId, materialized: bound.rows.length });
```

`needsRefresh(secret.expiresAt)` (CVS-141) gates a `refreshGoogleToken` before the run.

## Status

Built + fixture-tested (mocked `fetch`). **Going live needs CVS-280** (the Google OAuth app +
`GOOGLE_OAUTH_CLIENT_ID/_SECRET`). The full OAuth-callback + scheduled-sync wiring lands with
the Connected-Accounts UI (CVS-90) / a sync scheduler.
