# Data Source — known caveats & how to resolve them

> Companion to [`data-source-architecture.md`](./data-source-architecture.md). These are the **open caveats** left after Phase 3 was deployed to the live project (`iqrclwolhookzzmiedun`) on 2026-06-28. Each entry states the **symptom**, the **origin (root cause)**, how to **confirm** it, and the **fix**. None block the offline paths (Generate / Manual / File); they concern the warehouse path and local type-safety.

---

## Caveat 1 — Warehouse calls may 401 at the Edge Function gateway (Clerk JWT)

**Severity:** blocks the warehouse origin if it triggers. The File / Manual / Generate origins are unaffected (they never call the edge function).

### Symptom
In-app, the Source Node "Warehouse" actions (**Test / Save / Run**) fail with **HTTP 401**, and the 401 body is *not* our JSON (`{"error":"Missing Authorization header."}`) — it's the platform's shape, e.g. `{"code":401,"message":"Invalid JWT"}`. The request never reaches our function body.

### Origin (root cause)
The app authenticates with **Clerk** as a *third-party* auth provider through Supabase's native integration. Clerk mints **RS256** JWTs. Two different Supabase layers verify tokens, and they are configured **separately**:

1. **PostgREST / the database layer** — explicitly configured to *trust the Clerk issuer*, so `public.requesting_user_id()` resolves the Clerk user and RLS works. This is proven: the whole app already reads/writes via RLS with Clerk tokens.
2. **The Edge Functions API gateway** — when a function is deployed with `verify_jwt: true`, this gateway independently validates the incoming `Authorization` JWT **before** the function code runs. On some Supabase platform versions this gateway validated **only Supabase-issued HS256 tokens** (signed with the project JWT secret), and did **not** honor third-party (Clerk) JWKS. In that case it rejects the valid Clerk token with a 401 *at the gateway*, even though the same token works fine against the database.

So the root cause is a **mismatch between which token issuers the DB layer trusts vs. which the functions gateway trusts.** We deployed `warehouse-proxy` with `verify_jwt: true` (the secure default) and **could not runtime-test the Clerk happy-path** from the dev environment, so this is "deployed but unverified."

### How to confirm it
- Reproduce in-app; inspect the failing response. **Gateway 401** = body is the platform JSON (not ours) and **no log line** appears for the request.
- Check function logs: Supabase Dashboard → Edge Functions → `warehouse-proxy` → Logs (or MCP `get_logs`, service `edge-function`). If the request produced **no log entry**, the gateway rejected it before our code ran → it's this caveat. If you *do* see our logs and a different error, it's something else (look at Caveat 1b).

### Fix — pick one
**Option A (fast, 1 redeploy): set `verify_jwt: false`.**
Our function already implements its own authentication, so it stays safe:
- it rejects requests with no `Authorization` header;
- the user-scoped client runs **under RLS** — `requesting_user_id()` resolves the Clerk token at the DB layer (which *does* trust Clerk), so `source_connections` only returns the caller's own rows; `save` fails RLS for invalid tokens;
- secrets are read only with the service-role key, never returned to the client.

Redeploy: `npx supabase functions deploy warehouse-proxy --no-verify-jwt` (or via MCP `deploy_edge_function` with `verify_jwt: false`).

> **Residual risk to close when doing Option A:** the **`test`** action connects *outbound* to a user-supplied `host:port` **without needing any DB access**, so with the gateway check off, an unauthenticated caller could use the function as an outbound-connection probe (mild SSRF). **Mitigation to add at the same time:** inside the function, before handling `test`, verify the caller is a real signed-in user — e.g. call `userClient.auth.getUser()` (or a trivial RLS-guarded read) and 401 if it returns nothing. That restores "must be authenticated" without relying on the gateway.

**Option B (proper, if the platform supports it): make the gateway trust Clerk.**
Configure the Edge Functions gateway / project to validate the **Clerk third-party issuer/JWKS** for functions too (Supabase has been rolling third-party auth across the platform). If available for this project, keep `verify_jwt: true` and the Clerk token will validate at the gateway — no code change, strongest posture. Check current Supabase docs for "third-party auth + Edge Functions."

**Recommendation:** try Option B first (no residual risk); fall back to Option A + the `test`-action auth check if the gateway can't be configured.

---

## Caveat 1b — (only if you reach the function and `query`/`test` fails)
If logs *do* show our function running but the warehouse query errors:
- **`Connection not found` (404):** RLS returned no row → the `connectionId` isn't owned by the caller, or `requesting_user_id()` is null (token not trusted by the DB layer — different from 1a). 
- **`Credential not found` (404):** the `save` action didn't write `source_connection_secrets` (check the `save` path / service-role env).
- **postgres connect errors (500):** the target warehouse rejected the connection — SSL mode, firewall/IP allowlist (Supabase Edge runs from a cloud egress IP your warehouse must allow), wrong host/port/creds.
- **`row.toJSON` / column errors:** the SQL didn't alias columns to **`period`** and **`value`** — required by `seriesFromRows`.

---

## Caveat 2 — `sourceConnections.ts` uses `any` casts (types not regenerated)

**Severity:** cosmetic / type-safety only. No runtime effect.

### Symptom
`src/shared/lib/supabase/services/sourceConnections.ts` queries through an `asDb()` helper that casts the client to `any`, and ESLint reports 2 `@typescript-eslint/no-explicit-any` warnings there.

### Origin (root cause)
The app's DB types (`src/shared/lib/supabase/types.ts`, the `Database` type) are **generated from the schema**. When the service was written, `source_connections` didn't exist in those generated types (the table hadn't been created, and the local types file still hasn't been regenerated since it was). So `client.from('source_connections')` doesn't type-check against `Database`, and the cast was needed to compile.

### Fix (~10 min, do once the schema is stable)
1. Regenerate types now that the tables exist live:
   - `npm run prisma:types` (the repo's canonical path — Prisma db pull + generate + Zod), **or**
   - Supabase MCP `generate_typescript_types` / `npx supabase gen types typescript` → update `src/shared/lib/supabase/types.ts`.
2. In `sourceConnections.ts`: delete the `asDb()` helper, type the client as `SupabaseClient<Database>`, and drop the `as any`. Re-run `npm run type-check` + `npm run lint`.

---

## Caveat 3 — Local migration filename vs. live migration version mismatch

**Severity:** low; can cause a confusing double-apply on a future `supabase db push`.

### Symptom / origin
The migration was applied via **MCP `apply_migration`**, which assigned its own version timestamp **`20260628110840`** in the remote migration history. The local file is named **`20260628120000_source_connections.sql`**. Same SQL, two different version strings.

### Why it matters
A future `npx supabase db push` compares local filenames to the remote `supabase_migrations` history by version. Because the strings differ, it may treat the local file as a *new, unapplied* migration and run it again. The SQL is **idempotent** (`CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS … CREATE`), so re-applying is harmless — but the history would then list the migration twice.

### Fix
Either rename the local file to `20260628110840_source_connections.sql` to match the remote version, **or** run `npx supabase migration repair --status applied 20260628120000` after the next link so the histories reconcile. Do this before the next `db push`.

---

## Caveat 4 — Runtime-unverified paths (DuckDB file + warehouse end-to-end)

**Severity:** unknown until tested; code compiles and is wired correctly, but two paths were never exercised at runtime (no browser / no real warehouse in the build env).

- **DuckDB file origin** (`utils/duckdbEngine.ts`): lazy-loads `@duckdb/duckdb-wasm` from jsDelivr at first use and runs SQL over the uploaded file as the `data` view. Worth a manual smoke test: Source Node → File → upload a small CSV with `period,value` → `select period, value from data` → Run. Watch for: jsDelivr/WASM load failures (CSP / offline), and BigInt columns (handled by `normalizeRow`, but verify).
- **Warehouse end-to-end** depends on Caveat 1 being resolved + a reachable Postgres that allows the Supabase Edge egress IP.

### Also note (by design, not a bug)
The **file origin is transient**: the uploaded `File` is not persisted on the node (too large for `canvas_nodes.data`), so **re-running a `file` source needs re-upload**. Warehouse / Manual / Generate re-run from persisted config. If persistent file sources are wanted later, store the extract server-side (Supabase Storage) and reference it — that's a Phase-4-style change.

---

## Quick status table

| # | Caveat | Severity | Fix effort |
|---|--------|----------|-----------|
| 1 | Warehouse 401 at gateway (Clerk JWT vs `verify_jwt`) | Blocks warehouse path *if* it triggers | Option B config, or A: 1 redeploy + `test` auth-check |
| 2 | `any` casts (types not regenerated) | Cosmetic | ~10 min: regen types, drop casts |
| 3 | Migration version mismatch local↔remote | Low | rename file or `migration repair` |
| 4 | DuckDB + warehouse runtime-unverified | Unknown until tested | manual smoke test |
