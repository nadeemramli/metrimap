# Linear setup for System Health intake (A–Z)

Step-by-step to turn on the crash → Linear bridge (`sync-error-reports`). Once
done, runtime crashes reported in-app become deduplicated Linear issues in
Intake/Triage. Pairs with **[system-health-intake.md](./system-health-intake.md)**
(architecture) — this doc is the operator checklist.

> **Status: LIVE (2026-07-03).** For team **Canvasm** this is fully wired and
> verified end-to-end (a test issue was created in Triage and removed). Config is
> stored in **Supabase Vault** (not function-secret env), read by the edge function
> via the `public.error_sync_config()` RPC. The section below documents both paths;
> the Vault path is what's deployed. To change/rotate a value, update the Vault
> secret:
> ```sql
> select vault.update_secret(
>   (select id from vault.secrets where name = 'linear_api_key'), '<new-value>');
> -- names: linear_api_key, linear_team_id, error_sync_secret, error_sync_url
> ```

## 0. Where each credential lives

Three "homes" — don't mix them up:

| Where | Holds | Secret? |
|---|---|---|
| **Supabase Edge Function secrets** | `LINEAR_API_KEY`, `LINEAR_TEAM_ID`, `ERROR_SYNC_SECRET`, optional knobs | 🔒 yes — server-side only |
| **Supabase Vault** (`error_sync_url`, `error_sync_secret`) | the function URL + the same shared secret, read by the pg_cron job | 🔒 yes |
| **Linear** | labels, workflow states, the API key you generate | the API key is secret |

The Linear API key **never** goes in the browser bundle or git. It only lives in
Supabase function secrets.

---

## 1. Linear workspace & team

1. Create or open your Linear workspace.
2. Pick (or create) the **team** that will own System Health issues — e.g. a
   "Metrimap" or "Canvasm" team.
3. **Enable Triage** for that team (recommended): Team → **Settings → Triage → Enable**.
   The bridge auto-targets a Triage state. If you don't enable Triage, it falls
   back to a state named "Intake"/"Triage", else your Backlog — so at minimum make
   sure the team has a Backlog state (default teams do).

## 2. Create labels

Create these labels on the team (Team → **Settings → Labels**). The bridge only
**attaches labels that already exist** — it never creates them, to keep your
workspace clean. Match the names exactly (case-insensitive):

- `source:system-health`
- `type:bug`
- `runtime-error`
- `from:error-boundary`
- *(optional)* area labels like `area:canvas`, `area:dashboard`

If you skip a label, it's simply not attached — no error. You can change the set
later via the `LINEAR_LABEL_NAMES` env var (Section 8).

## 3. Create a Personal API key

1. Linear → **Settings → Security & access → API → Personal API keys → New key**.
2. Name it e.g. `metrimap-system-health`. Copy the key (starts with `lin_api_...`).
   You won't see it again.

> The key acts as **you** — issues/comments it creates are authored by your user.
> That's fine for MVP. (An OAuth actor is a later upgrade if you want issues
> authored by a bot.)

## 4. Get the IDs you need

You need the **team ID** (a UUID, not the `ENG`-style key). Optionally a state ID
and project ID. Easiest is one API call — with the key from Section 3:

```bash
export LINEAR_API_KEY=lin_api_xxx   # the key you just made

curl -s https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d '{"query":"{ teams { nodes { id name key states { nodes { id name type } } labels { nodes { id name } } } projects { nodes { id name } } } }"}' \
  | jq
```

From the output:
- **`teams.nodes[].id`** for your team → this is `LINEAR_TEAM_ID` (required).
- *(optional)* a `states.nodes[]` with `type: "triage"` (or your Intake state) →
  `LINEAR_STATE_ID`. Skip it and the bridge resolves the state automatically.
- *(optional)* a `projects.nodes[].id` → `LINEAR_PROJECT_ID` to file issues into a
  project.
- Confirm your Section 2 labels appear under `labels.nodes[]`.

No `jq`? Drop the `| jq` and read the raw JSON, or paste it to me.

## 5. Generate the shared secret

The pg_cron job authenticates to the edge function with a shared secret. Generate one:

```bash
openssl rand -hex 32
```

Call this value `ERROR_SYNC_SECRET`. It goes in **two** places (they must match):
the function secrets (Section 6) and the Vault `error_sync_secret` (Section 6.3).

## 6. Set secrets & deploy

Run from the repo root (needs the Supabase CLI linked to project
`iqrclwolhookzzmiedun`). See `@AGENTS.md` for CLI env vars.

**6.1 — Function secrets:**

```bash
npx supabase secrets set \
  ERROR_SYNC_SECRET=<the openssl value from Section 5> \
  LINEAR_API_KEY=<lin_api_... from Section 3> \
  LINEAR_TEAM_ID=<team UUID from Section 4>
```

**6.2 — Deploy the function** (`--no-verify-jwt` because it authenticates via the
`x-sync-secret` header, not a user JWT):

```bash
npx supabase functions deploy sync-error-reports --no-verify-jwt
```

**6.3 — Register the cron target in Vault** (Supabase → SQL editor). This is what
the already-scheduled pg_cron job reads; it's kept out of git on purpose:

```sql
select vault.create_secret(
  'https://iqrclwolhookzzmiedun.functions.supabase.co/sync-error-reports',
  'error_sync_url'
);
select vault.create_secret(
  '<the SAME openssl value from Section 5>',
  'error_sync_secret'
);
```

The cron job (`error-report-sync`, every 5 min) is already scheduled and no-ops
until both Vault secrets exist.

## 7. Turn it on & verify

1. **Trigger a report**: in the app hit a crash and click "Report this error"
   (or insert a test row). A row lands in `error_reports`; the trigger creates an
   `error_report_groups` row with `sync_status='pending'`.
2. **Run the sync now** (don't wait 5 min): `npm run sync:errors`. Expect JSON like
   `{ ok:true, created:1, ... }`.
3. **Check Linear**: a new issue appears in Intake/Triage titled
   `Runtime error on <route>: <message>`, with your labels and a structured body.
4. **Dedup**: report the same crash again → `npm run sync:errors` → the existing
   issue gets a "N new occurrences" comment (rate-limited to ~45 min), no duplicate.
5. **Retry failures** anytime: `npm run sync:errors -- --retry-failed`.

After that, the pg_cron job keeps it running automatically every 5 minutes.

## 8. Optional knobs (function secrets)

Set any of these with `npx supabase secrets set NAME=value`:

| Env | Default | Purpose |
|---|---|---|
| `LINEAR_STATE_ID` | auto (Triage→Intake→Backlog) | pin the exact target state |
| `LINEAR_PROJECT_ID` | none | file issues into a project |
| `LINEAR_LABEL_NAMES` | `source:system-health,type:bug,runtime-error,from:error-boundary` | which existing labels to attach |
| `ERROR_SYNC_INCLUDE_DEV` | `false` | also sync `localhost` crashes |
| `ERROR_SYNC_BATCH` | `25` | max groups per run |
| `ERROR_SYNC_COMMENT_WINDOW_MIN` | `45` | min minutes between repeat comments |

---

## Credentials summary — the short list

| Value | Required | Where to get it | Where it goes |
|---|---|---|---|
| `LINEAR_API_KEY` | ✅ | Section 3 | Supabase function secret |
| `LINEAR_TEAM_ID` | ✅ | Section 4 (API) | Supabase function secret |
| `ERROR_SYNC_SECRET` | ✅ | Section 5 (`openssl`) | function secret **and** Vault `error_sync_secret` |
| function URL | ✅ | fixed (Section 6.3) | Vault `error_sync_url` |
| `LINEAR_STATE_ID` / `LINEAR_PROJECT_ID` | optional | Section 4 | function secret |

## If you'd rather I do the wiring

The build is done; deploy is the part that needs your Linear account. If you want
me to fetch the team/state/label IDs and wire + live-test end-to-end, add just
these to the **git-ignored `.env`** and tell me:

```
LINEAR_API_KEY=lin_api_...
LINEAR_TEAM_ID=...          # optional — I can look it up from the key
```

I'll run the ID lookup, set the function secrets, deploy, register the Vault
secrets, and create + clean up a real test issue to confirm the loop. Otherwise
follow Sections 1–7 and you're done.
