# System Health intake (runtime crashes → Linear)

Turns in-app runtime crashes into deduplicated **Linear** issues for triage, without
ever exposing a Linear credential to the browser. Implements the Development
Operating System's System Health intake (see the vault note of the same name).

## Flow

```
Runtime crash
  └─ ErrorBoundary "Report this error"        (browser)
       └─ INSERT public.error_reports         (anon Supabase client, raw event log)
            └─ trigger rollup_error_report()  (per-fingerprint group)
                 └─ public.error_report_groups (sync_status='pending')
                      └─ pg_cron every 5 min → dispatch_error_report_sync()
                           └─ edge fn `sync-error-reports`  (holds LINEAR_API_KEY)
                                └─ create/comment Linear issue (Intake/Triage)
```

The browser only ever writes to Supabase. Linear is reached only server-side.

## Pieces

| Piece | Path |
|---|---|
| Fingerprint (client) | `src/shared/utils/errorFingerprint.ts` |
| Report insert + fingerprint | `src/shared/components/common/error/ErrorBoundary.tsx`, `src/shared/lib/supabase/services/errorReports.ts` |
| Rollup + groups table | `supabase/migrations/20260703130000_error_report_intake.sql` |
| Cron dispatch | `supabase/migrations/20260703140000_error_report_sync_cron.sql` |
| Sync bridge | `supabase/functions/sync-error-reports/index.ts` |
| Manual run / retry | `scripts/sync-error-reports.mjs` (`npm run sync:errors`) |

## Fingerprinting

`computeErrorFingerprint` hashes **message + top stack frame + top component frame +
route path**, after scrubbing dynamic ids, bundle content-hashes, and line/col
numbers — so the same crash groups across deploys and across per-id routes. It
deliberately **excludes** user id, email, note text, timestamps, and query values.
A DB trigger rolls each report into `error_report_groups` (the Linear unit);
`error_reports` stays the raw event log.

## Deploy (one-time)

> For the full step-by-step operator walkthrough (Linear account, labels, API key,
> IDs, secrets), see **[linear-setup.md](./linear-setup.md)**. Short version below.

Migrations are already applied. To turn on the Linear sync:

1. **Create Linear labels** on the target team (only existing labels are attached —
   the bridge never creates them): `source:system-health`, `type:bug`,
   `runtime-error`, `from:error-boundary` (+ optional `area:*`). Ensure the team has
   an **Intake/Triage** state (auto-resolved by type/name, or pin with `LINEAR_STATE_ID`).

2. **Set edge-function secrets** and deploy:
   ```bash
   npx supabase secrets set \
     ERROR_SYNC_SECRET=<random-shared-secret> \
     LINEAR_API_KEY=<linear-personal-api-key> \
     LINEAR_TEAM_ID=<team-id>
   # optional: LINEAR_STATE_ID, LINEAR_PROJECT_ID, LINEAR_LABEL_NAMES,
   #           ERROR_SYNC_INCLUDE_DEV, ERROR_SYNC_BATCH, ERROR_SYNC_COMMENT_WINDOW_MIN
   npx supabase functions deploy sync-error-reports --no-verify-jwt
   ```

3. **Register the cron target in Vault** (secret-free in git; the migration reads these):
   ```sql
   select vault.create_secret('https://iqrclwolhookzzmiedun.functions.supabase.co/sync-error-reports', 'error_sync_url');
   select vault.create_secret('<same-random-shared-secret>', 'error_sync_secret');
   ```
   Until both exist, `dispatch_error_report_sync()` no-ops, so nothing syncs.

`ERROR_SYNC_SECRET` (function env) and the `error_sync_secret` Vault value **must
match** — it's the shared secret the cron sends as `x-sync-secret`.

## Linear issue behavior

- One issue per fingerprint, created in **Intake/Triage** with priority Medium
  (High if it repeats ≥10×). Labels: existing ones matching `LINEAR_LABEL_NAMES`.
- Repeats **comment** on the same issue ("N new occurrences since last sync"),
  rate-limited to once per `ERROR_SYNC_COMMENT_WINDOW_MIN` (default 45 min).
- Localhost crashes are **skipped** unless `ERROR_SYNC_INCLUDE_DEV=true`.
- Failures set `sync_status='failed'` + `sync_error`; retry with
  `npm run sync:errors -- --retry-failed`.

## Verify

- Insert an anon `error_reports` row with a `fingerprint` → a matching
  `error_report_groups` row appears (`occurrence_count` increments on repeats).
- `SELECT * FROM cron.job WHERE jobname='error-report-sync'` → active, `*/5 * * * *`.
- After deploy + Vault secrets: a new crash creates one Linear issue; a repeat
  comments on it; a different fingerprint creates a separate issue.
- `error_report_groups` is not client-readable (RLS, no policies); anon
  `error_reports` insert still works; anon select still blocked.

## Non-goals (MVP)

In-app admin dashboard, auto-prioritization beyond the repeat heuristic, knowledge
notes per error, full incident management. Supabase remains the raw event store;
Linear is the work item.
