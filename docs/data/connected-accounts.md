# Connected accounts (connector connection layer)

The server-side connection model under the Connected Accounts settings surface
(CVS-90) for **native SaaS connectors** — GA4, Stripe, WooCommerce, Shopify, PostHog,
… (CVS-141). Distinct from the warehouse `source_connections` (Data hub); this is the
OAuth / API-key layer that the connectors (CVS-142–150) query through.

Code: `src/shared/lib/connectors/connections/`. Migration:
`supabase/migrations/20260706120000_connected_accounts.sql`.

## Two tables, two trust levels (same shape as `source_connections`)

| table | contains | access |
| --- | --- | --- |
| `connected_accounts` | **non-secret** metadata: connector id, auth type, source account id/label, granted scopes, status, timestamps | **workspace-scoped RLS** — creator or `workspace_id = requesting_org_id()` |
| `connected_account_secrets` | **encrypted** tokens/keys (access/refresh/api_key ciphertext, expiry) | **service-role only** — RLS enabled with **no policies** + `REVOKE` from anon/authenticated |

The browser only ever touches `connected_accounts` (via `connectedAccounts.ts`), so a
user can see connection **status** but never token material. Tokens are written/read
only by server code holding the service-role key (OAuth-callback edge function, fetch
runtime), via `secrets.ts`.

## Encryption

Tokens are **AES-256-GCM** ciphertext (`crypto.ts`) before they hit the database — so
even the row value is opaque without the key. The key is 32 raw bytes supplied as
base64 in the server env **`CONNECTOR_SECRET_KEY`** and is never shipped to the
browser. Wire format: `base64(12-byte IV ‖ ciphertext+tag)`, fresh IV per encryption.

> **Setup (owner):** generate once with `openssl rand -base64 32` and set
> `CONNECTOR_SECRET_KEY` in the server environment (Vercel / edge-function secrets).
> Rotating it requires re-encrypting stored secrets — treat as a break-glass op.

## Module boundaries

- **`connectedAccounts.ts` (client-safe)** — `listConnectedAccounts`, `getConnectedAccount`,
  `createPendingConnection` (starts an OAuth/API-key connect as a `pending` row),
  `renameConnection`, `removeConnection` (delete → FK cascade drops the secret). RLS
  does the scoping; no secret ever crosses this boundary.
- **`secrets.ts` (SERVER-ONLY — never import into the browser bundle)** — takes a
  service-role client. `storeAccountSecret` (encrypt + upsert + flip status to
  `connected`), `readAccountSecret` (decrypt), `revokeAccountSecret` (delete token +
  mark `revoked`), `markConnectionError` (payload-free failure), `needsRefresh`
  (expiry-with-skew check for the refresh loop).

## Connection lifecycle

```
createPendingConnection ──▶ status=pending
   (OAuth redirect / API-key submit)
server callback: storeAccountSecret ──▶ status=connected  (tokens encrypted, stored)
fetch runtime: needsRefresh? ──▶ refresh (provider-specific, CVS-146+) ──▶ storeAccountSecret
on failure: markConnectionError ──▶ status=error (payload-free detail)
revokeAccountSecret ──▶ status=revoked (token row deleted, audit row kept)
removeConnection ──▶ row deleted, secret cascade-dropped
```

`connector_id` is stored as free text validated by the manifest registry (CVS-140), not
a DB `CHECK`, so new connectors ship without a migration.

## Security invariants (verified in manual test / CVS-153)

1. Browser responses never include token material (only `connected_accounts` columns).
2. Cross-workspace denial: a user in workspace B cannot read/update/delete workspace A's
   connections (RLS mirrors the audited `workspace_org_scoping` policy).
3. Secrets table is unreachable by anon/authenticated (RLS no-policies + `REVOKE`).
4. Logs and `status_detail` stay **payload-free** — error class/message only.
