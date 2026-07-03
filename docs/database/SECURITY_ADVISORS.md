# Supabase security advisors — triage & accepted findings

Reference for the `get_advisors` (security) output, so nobody "fixes" a finding
that is intentional and breaks the app. Companion to the hardening work in
**CVS-127**. Re-run advisors after any grant/RLS/schema change.

Baseline (2026-07-04): **98 findings — 96 WARN, 2 INFO.**

## Fixed / to fix

| Finding | Count | Action |
|---|---|---|
| `function_search_path_mutable` (`stamp_updated_by_and_at`) | 1 | **Fixed** — Phase 1 migration sets a fixed `search_path`. |
| `{anon,authenticated}_security_definer_function_executable` on **trigger/cron** funcs | 18 | **Fixed** — Phase 1 revokes EXECUTE from `anon`+`authenticated` on 9 trigger/cron functions (`service_role` kept). |
| `pg_graphql_{anon,authenticated}_table_exposed` | 56 | **Owner action** — the app is pure PostgREST; the GraphQL endpoint is unused. Disable it: **Dashboard → Settings → API → Exposed schemas → remove `graphql_public`**. Clears all 56 at once. Not a migration (exposed-schemas is platform-managed; `authenticator` has no `pgrst.db_schemas` GUC). |
| `extension_in_public` (`pg_net`) | 1 | **Deferred** — `pg_net` is a dependency of the error-sync cron (`dispatch_error_report_sync`); moving it out of `public` needs the cron updated too. Separate careful change. |

## ✅ Accepted by design — do NOT "fix"

These are flagged but are correct for how the app works. Changing them **breaks**
the app.

### 1. `anon`/`authenticated` EXECUTE on identity & permission helpers
Functions: `get_clerk_user_id`, `get_current_user_id`, `requesting_user_id`,
`requesting_org_id`, `has_project_access`, `can_view_project`,
`can_comment_project`, `my_project_permission` (+ client RPCs `emit_card_alert`,
`notify_card_assigned`).

**Why accepted:** RLS policies on `metric_cards`, `canvas_nodes`, `relationships`,
`comments`, `projects` (incl. **public** projects via `is_public`), etc. are
declared `TO public` / `TO anon, authenticated` and call these helpers inside
`USING` / `WITH CHECK`. Postgres evaluates the policy as the querying role, so the
`anon` role **must** retain EXECUTE — revoking it throws `permission denied for
function …` on anon/public reads. The functions are `SECURITY DEFINER` with a
fixed `search_path` and only return the caller's own identity/permission, so
exposure is safe.

### 2. `rls_enabled_no_policy` — `error_report_groups`, `userback_feedback` (INFO)
RLS on with **no policies** = deny-all to anon/authenticated by design; only the
service role (edge functions) touches these tables.

### 3. `rls_policy_always_true` — `error_reports` INSERT (`WITH CHECK true`)
Intentional: unauthenticated in-app crash reporting must be able to insert.

## Net after Phase 1 + GraphQL disable

96 WARN → a small **accepted-by-design** set (the helper-EXECUTE findings above) +
the deferred `pg_net` item. Track re-runs against this baseline.
