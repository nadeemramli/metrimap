# Connector fetch runtime (data layer)

The fetch runtime (`src/shared/lib/connectors/runtime/`, CVS-142) is the shared engine that
runs one connector **stream** end to end: it paces requests to the source, retries transient
failures, times out slow pages, walks pagination, advances the persisted **cursor** only
after a page succeeds, and returns a **payload-free** run summary. Every native connector
(CVS-146–150) implements a thin adapter and lets the runtime own these mechanics.

It builds on the [manifest registry](./connector-manifests.md) (CVS-140, for rate-limit and
stream metadata) and feeds the [canonical](./canonical-schemas.md) normalizer (CVS-143).
Credentials are **injected** — the runtime never reads secrets; the connection/token model
(CVS-141) resolves them at the connector-MVP layer.

## The adapter

A connector implements one method:

```ts
interface ConnectorAdapter {
  connectorId: string;
  fetchPage(input: FetchPageInput): Promise<FetchPageResult>;
}
```

`FetchPageInput` carries the stream, sync mode, injected `credentials`, the incremental
`cursor` (across runs), the `pageToken` (within a run), and an `AbortSignal`.
`FetchPageResult` returns the page's raw `records`, an optional `nextPageToken` (absent =
stream exhausted), and an optional updated `cursor`.

## What the runtime guarantees

`runStream(adapter, manifest, stream, options)`:

- **Pacing** — a `RateLimiter` derived from `manifest.rate_limit` (requests-per-minute for
  `token_bucket`/`fixed_window`; no delay for `concurrency`/`none`).
- **Retries** — `withRetry` backs off exponentially with full jitter and honors a source's
  `Retry-After` on rate-limit errors. Only `transient`/`rate_limit`/`timeout` classes retry;
  `auth`/`permanent` fail fast (see `errors.ts`).
- **Timeout** — an optional per-page budget that aborts the adapter's request.
- **Cursor safety** — the cursor is persisted **only after a page is fetched and handled**,
  so a run that fails partway is `resumable` from the last good page — no duplicated or
  skipped records. Cursors are opaque strings stored payload-free (`CursorStore`).
- **Caps** — `maxRecords` bounds a run (powers the 5–10 record sample preview, decision
  CVS-137 §8).
- **Payload-free reporting** — `RunReport` carries counts (`pages`, `fetched`, `skipped`,
  `rejected`), a stable `error_class`, `resumable`, and timestamps — never a source record
  or token. Verified by test.

Normalization/validation is **not** here — an optional `onRecords` handler lets the CVS-143
normalizer plug in and report `skipped`/`rejected`, keeping fetch and normalize separable.

## Testing

`mockConnector.ts` (shipped in `src/`, reused by the CVS-154 QA suite) provides
`createMockConnector` — pre-defined pages with pagination/cursors and injectable per-page
transient failures — and `createManualClock`, a deterministic clock whose `sleep` advances
virtual time instantly so backoff and rate-limit waits are exercised without real delays.
