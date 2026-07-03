# Userback → Linear Customer Requests bridge

Turns **Userback** feedback into Linear **Customer Requests** (customer needs
attached to issues), so feedback is structured, linked to work, and visible on
per-customer pages. Server-side by design — the Linear API key lives only in the
edge function, never in the browser. Same shape as the System Health bridge
([linear-setup.md](./linear-setup.md)); read that first for the shared-secret /
Vault model.

> **Status: BUILT, not yet deployed (2026-07-04).** Code + migration are in the
> repo (CVS-26). Turning it on needs a Userback account + the deploy steps below.
> Customer Requests is already **enabled** on the Canvasm workspace.

## Architecture

```
Userback (new feedback)
   │  webhook POST (x-userback-secret)
   ▼
edge fn  userback-customer-requests          ← ONLY holder of LINEAR_API_KEY
   │  1. upsert into public.userback_feedback (idempotent by userback_id)
   │  2. resolve/create Linear Customer  (email domain → Customer, cached in our table)
   │  3. issueCreate  (Triage, labels if they exist)
   │  4. customerNeedCreate  (feedback → Customer Request on that issue)
   ▼
Linear: Customer page shows the request, linked to a Triage issue
```

`public.userback_feedback` is the raw, insert-only evidence store **and** the
idempotency/sync ledger (dedup by `userback_id`). RLS is on with **no policies** —
only the edge function (service role) reads/writes it; the browser never does.

## What maps to what

| Userback | Linear |
|---|---|
| feedback id | `userback_feedback.userback_id` (dedup key) |
| reporter email **domain** (company) | **Customer** (`domains`, `externalIds:[userback:domain:<d>]`) |
| reporter email (personal / no domain) | individual **Customer** (`externalIds:[userback:email:<e>]`) |
| feedback title/description | **issue** (Triage) + **Customer Request** body |
| rating ≤ 2 (unhappy) | request **marked important** (`priority: 1`) |

Company vs personal domain is decided by a small allow-list of personal providers
in the edge function (`PERSONAL_DOMAINS`). A domain's Customer is created once and
reused for later feedback (cached via `userback_feedback.reporter_domain`).

## 1. Enable Customer Requests

Linear → **Settings → Customer Requests → Enable**; set the **default team =
Canvasm**. (Native Intercom/Zendesk/Front sources need Business+, but the **API**
path used here works on lower plans.)

## 2. Create labels (optional)

The bridge only attaches labels that **already exist** (never creates them). Add
these on the Canvasm team to get them on feedback issues (case-insensitive):

- `source:user-signal`
- `type:feedback`
- `from:userback`

Change the set with the `USERBACK_LABEL_NAMES` env (Section 6). Skip any and it's
simply not attached.

## 3. Secrets

Reuse the System Health `linear_api_key` + `linear_team_id` (same workspace/team),
and generate one new shared secret for this webhook:

```bash
openssl rand -hex 32   # -> USERBACK_SYNC_SECRET
```

## 4. Apply the migration

```bash
npx supabase db push          # applies 20260704120000_userback_feedback_intake.sql
```

Creates `public.userback_feedback` (RLS on, no policies) and
`public.userback_sync_config()` (service-role-only Vault reader).

## 5. Deploy the function

```bash
# Function secrets (env wins over Vault):
npx supabase secrets set \
  USERBACK_SYNC_SECRET=<openssl value from Section 3> \
  LINEAR_API_KEY=<lin_api_...> \
  LINEAR_TEAM_ID=<team UUID>

# --no-verify-jwt: auth is the x-userback-secret header, not a user JWT.
npx supabase functions deploy userback-customer-requests --no-verify-jwt
```

Or store the secrets in **Vault** instead of function secrets (read by
`userback_sync_config()`), mirroring `linear-setup.md` §6.3:

```sql
select vault.create_secret('<openssl value>', 'userback_sync_secret');
-- linear_api_key / linear_team_id already exist from the System Health bridge.
```

## 6. Optional knobs (function secrets)

| Env | Default | Purpose |
|---|---|---|
| `LINEAR_STATE_ID` | auto (Triage→Intake→Backlog) | pin the target state |
| `LINEAR_PROJECT_ID` | none | also file feedback issues into a project |
| `USERBACK_LABEL_NAMES` | `source:user-signal,type:feedback,from:userback` | labels to attach (existing only) |
| `USERBACK_SYNC_BATCH` | `25` | max feedback rows processed per invocation |

## 7. Point Userback at the function

In Userback → **Integrations / Webhooks**, add a webhook on **new feedback**:

- URL: `https://<project-ref>.functions.supabase.co/userback-customer-requests`
- Header: `x-userback-secret: <USERBACK_SYNC_SECRET>`

The function accepts most Userback payload shapes (`{feedback}`, `{data}`, or a
flat object) and needs at least a feedback **id**.

## 8. Verify

```bash
npm run sync:userback -- --sample   # injects one sample feedback, then syncs
```

Expect `{ ok:true, intake:1, created:1, ... }`, then in Linear:

1. A new **Customer** (`acme-example.com`) with a **Customer Request** on its page.
2. A Triage **issue** titled `Feedback: Sample feedback …`, request marked
   important (rating 2).
3. Re-run → `deduped`/no new issue (idempotent by `userback_id`).

Retry any failures: `npm run sync:userback -- --retry-failed`.

## 9. Onboard business owners as Customers

For AC "business owners onboarded as Customers": create a Customer per community
business owner (Linear → Customers, or the API), set tier/size/revenue, and use
the **customer-count** view + **mark-important** to triage. Feedback from a known
domain then lands on that owner's existing Customer automatically.

## Notes

- `userback_feedback` is server-only (no client access), so it is **not** added to
  `src/shared/lib/supabase/types.ts` and needs no Prisma regen — the app never
  queries it.
- No secrets are committed; `LINEAR_API_KEY` never reaches the browser bundle.
