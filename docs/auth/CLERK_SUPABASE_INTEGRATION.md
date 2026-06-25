# Clerk + Supabase Integration (Metrimap)

How authentication actually works in this codebase: **Clerk** owns identity and sessions; **Supabase** (Postgres + RLS) owns data. They are connected with Clerk's **native third-party auth** — no JWT template — and authorization is enforced in Postgres via RLS keyed on the Clerk user id.

> This is the project-specific guide. For decision rationale see [ADR-002](../adr/ADR-002:%20Using%20Clerk%20for%20User%20Management.md). For upstream reference, see the official [Clerk + Supabase docs](https://clerk.com/docs/integrations/databases/supabase) and [Supabase third-party auth](https://supabase.com/docs/guides/auth/third-party/clerk).

## Architecture

```
Clerk (sign-in, session, user store)
   │  getToken()  → short-lived session JWT (sub = Clerk user id)
   ▼
Supabase JS client created with accessToken() callback
   │  every request carries the Clerk JWT
   ▼
Postgres + RLS  → policies match requesting_user_id() (= JWT `sub`) against row owner
```

Key files:

| Concern | File |
|---------|------|
| Clerk → Supabase user sync | `src/features/auth/components/ClerkSupabaseProvider.tsx` |
| Supabase client factories | `src/shared/lib/supabase/client.ts` |
| Route protection | `src/features/auth/components/ProtectedRoute.tsx` |
| Input validation on sync | `src/shared/lib/validation/zod.ts` (`CreateUserSchema`) |

## How the connection is made

The Supabase client is created with an `accessToken()` callback that returns Clerk's session token. This is the **non-deprecated native integration** — it does *not* require configuring a Clerk JWT template.

```typescript
// src/shared/lib/supabase/client.ts
export const createClerkSupabaseClient = (
  getToken: () => Promise<string | null>
) => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    async accessToken() {
      return await getToken(); // Clerk session token, refreshed automatically
    },
  });
};
```

The provider wires Clerk's `getToken` into that factory and keeps the Supabase `users` row in sync on every auth change:

```typescript
// src/features/auth/components/ClerkSupabaseProvider.tsx (essence)
const { user, isLoaded } = useUser();
const { getToken } = useAuth();

// native approach — no JWT template
const getClerkSessionToken = async () => await getToken();
const supabaseClient = createClerkSupabaseClient(getClerkSessionToken);

// validate before write (see ADR-006), then upsert the mirror row
CreateUserSchema.parse({ email, name, avatar_url });
await supabaseClient.from('users').upsert(userPayload, { onConflict: 'id' });
```

> Note: the `users.id` stored in Supabase is the **Clerk user id** (e.g. `user_xxx`), which is also the JWT `sub`. That equivalence is what makes RLS work.

## Row Level Security

RLS policies authorize rows by comparing the requesting user's Clerk id (from the JWT `sub` claim) to the row's owner. A SQL helper extracts it:

```sql
-- requesting_user_id() reads the Clerk `sub` claim from the verified JWT
create or replace function requesting_user_id() returns text as $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$ language sql stable;

-- example policy
create policy "Users can manage own profile"
  on public.users for all
  using (id = requesting_user_id());
```

Policy details and the full set live in the Supabase migrations and in `docs/database/RLS_SOLUTION_SUMMARY.md`. Test RLS against a **remote/staging** project (see below for why local dev bypasses it) — `docs/database/RLS_TESTING_GUIDE.md`.

## Environments: production vs local dev

`client.ts` detects the environment from the Supabase URL and exposes three client factories:

| Factory | When | Auth / RLS |
|---------|------|-----------|
| `createClerkSupabaseClient(getToken)` | Authenticated app usage | Clerk JWT via `accessToken()`; **RLS enforced** |
| `supabase()` | Default singleton (anon) | Anon key; RLS enforced |
| `createDevSupabaseClient()` | **Local** dev (`localhost`/`127.0.0.1`) | Service-role key; **RLS bypassed** |

Local development deliberately bypasses Clerk and RLS using the service-role key so you can work without a live Clerk session:

```env
# .env (project root) — local development
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<anon key>
VITE_SUPABASE_SERVICE_ROLE_KEY=<service role key>   # required for local dev only
```

> **Consequence:** because local dev bypasses RLS, RLS regressions will not show up locally. Always validate RLS changes against a remote/staging environment.

Production reads `VITE_SUPABASE_*`, falling back to `NEXT_PUBLIC_SUPABASE_*` for deployment compatibility. The service-role key must **never** be shipped to production builds.

## Session token customization (optional)

The native integration works without custom claims. If you later need extra claims (e.g. `fullName`, `primaryEmail`) on the Clerk session token:

1. Clerk Dashboard → **Sessions** → **Customize session token** → add claims (keep total custom claims **under ~1.2KB** — the cookie cap is 4KB).
2. Read them server-side via the Clerk `Auth` object's `sessionClaims`.
3. For TypeScript autocompletion, declare a global `CustomJwtSessionClaims` interface in `types/globals.d.ts`.

This is optional and not currently required by the app.

## Setup checklist

- [ ] `VITE_CLERK_PUBLISHABLE_KEY` set (Clerk provider in `src/main.tsx`).
- [ ] Clerk configured as a Supabase third-party auth provider (Supabase Dashboard → Authentication → Third-party).
- [ ] `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` set; `VITE_SUPABASE_SERVICE_ROLE_KEY` set for local dev only.
- [ ] `requesting_user_id()` and RLS policies applied (migrations).
- [ ] `users` table keyed by Clerk user id; sync verified via `ClerkSupabaseProvider`.

## Troubleshooting

| Symptom | Likely cause |
|---------|--------------|
| Rows return empty for a logged-in user | JWT `sub` not reaching Postgres, or RLS policy compares against the wrong column. Verify the client uses `accessToken()`. |
| Works locally but not in staging/prod | Local dev bypasses RLS (service-role). The RLS policy is actually broken — test on remote. |
| "Supabase URL/anon key is required" | Missing env vars; `.env` must be at project root and the dev server restarted after edits. |
| User row never created | `ClerkSupabaseProvider` not mounted, `CreateUserSchema.parse` throwing, or upsert blocked by RLS. Check console logs. |

## References

- [ADR-002: Using Clerk for User Management](../adr/ADR-002:%20Using%20Clerk%20for%20User%20Management.md)
- [ADR-006: Prisma + Zod](../adr/ADR-006:%20Use%20Prisma%20+%20Zod.md) (validation on user sync)
- `docs/database/RLS_SOLUTION_SUMMARY.md`, `docs/database/RLS_TESTING_GUIDE.md`, `docs/database/SUPABASE_CLIENT_SINGLETON.md`
- `docs/environment/ENVIRONMENT_GUIDE.md`, `docs/environment/ENVIRONMENT_SECRETS.md`
