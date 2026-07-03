# Server-side user provisioning (Clerk webhook)

Reliably creates/updates the `public.users` row for every Clerk user, server-side —
so ownership/collaborator foreign keys always resolve. Fixes CVS-74.

## Why

Provisioning used to be **client-side** (`ClerkSupabaseProvider` upserts `users` in a
`useEffect` right after Clerk loads, using the Clerk-token Supabase client). That path
is RLS-gated (`users_insert WITH CHECK (id = requesting_user_id())`) and races the
token — and it **swallows failures** (`console.error` only). So a first-login `users`
row could silently never be created, breaking collaborator/owner FKs.

The webhook makes it deterministic: Clerk fires `user.*` events server-to-server, and
the edge function upserts with the **service role** (bypasses RLS, no token race).

## Flow

```
Clerk (user.created / user.updated)
  → POST edge fn `clerk-webhook`  (verify Svix signature)
    → upsert public.users (service role): id, email, name, avatar_url, updated_at
```

`user.deleted` is intentionally a no-op — hard-deleting the row would orphan
ownership/collaborator FKs. (Revisit with a soft-delete if ever needed.)

The old client-side upsert is left in place as a harmless best-effort fallback.

## Setup (one-time)

The edge function is already deployed (`clerk-webhook`, `verify_jwt` off). To turn it on:

1. **Clerk → Configure → Webhooks → Add Endpoint**
   - Endpoint URL: `https://iqrclwolhookzzmiedun.functions.supabase.co/clerk-webhook`
   - Subscribe to: **`user.created`**, **`user.updated`** (optionally `user.deleted`).
   - Create it, then copy the **Signing Secret** (`whsec_…`).

2. **Set the secret in Supabase** → Dashboard → **Edge Functions → Manage secrets** →
   add `CLERK_WEBHOOK_SIGNING_SECRET = whsec_…`. (No CLI needed — the dashboard sets
   function secrets directly.)

3. Done. Until the secret is set, the function returns `500 { "CLERK_WEBHOOK_SIGNING_SECRET not configured" }` and provisioning falls back to the client-side path.

## Verify

- **Reachable / fail-safe:** `curl -X POST https://iqrclwolhookzzmiedun.functions.supabase.co/clerk-webhook -d '{}'` → `{"error":"CLERK_WEBHOOK_SIGNING_SECRET not configured"}` before setup.
- **After setup:** in Clerk → Webhooks → your endpoint → **Send test event** (`user.created`) → expect `200 {"ok":true,"action":"upsert"}` and a matching row in `public.users`.
- **Real signup:** create a new Clerk user → confirm a `users` row appears within seconds.
- **Bad signature** (any random POST with a body) → `401 {"error":"Invalid signature"}`.
