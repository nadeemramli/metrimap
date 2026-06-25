# ADR-002: Using Clerk for User Management

- **Status:** Accepted
- **Date:** 2025
- **Deciders:** Core team

## Context

The app needs authentication and user management (sign-up, sign-in, sessions, profile) without building it in-house. The data layer is Supabase (Postgres + Row Level Security), so whatever auth provider we choose must be able to drive Supabase RLS via a verifiable JWT.

## Decision

Use **Clerk** (`@clerk/react-router`) as the auth provider, integrated with Supabase using Clerk's **native third-party auth** (not the deprecated JWT-template flow):

- The Supabase client is created with an `accessToken()` callback that returns Clerk's session token via `getToken()` — **no custom JWT template required**. See `createClerkSupabaseClient()`.
- On login, `ClerkSupabaseProvider` upserts the Clerk user into the Supabase `users` table (validated with `CreateUserSchema` before write — see [ADR-006](./ADR-006:%20Use%20Prisma%20%2B%20Zod.md)).
- Supabase RLS policies authorize rows by matching the JWT `sub` claim via a `requesting_user_id()` SQL function.
- **Local development** bypasses Clerk and RLS using a service-role Supabase client (`createDevSupabaseClient()`), selected by environment detection on the Supabase URL.

## Alternatives Considered

- **Supabase Auth** — Rejected: we preferred Clerk's hosted UI, session management, and organization features.
- **Auth0 / custom auth** — Rejected: more integration effort, less turnkey UI.
- **Clerk JWT-template → Supabase** — Rejected in favor of the newer native `accessToken()` integration, which Clerk now recommends and which avoids template drift.

## Consequences

- Two systems of record for identity: Clerk is authoritative; the Supabase `users` row is a mirror kept in sync on login.
- RLS correctness depends on the Clerk `sub` claim reaching Postgres — see the RLS guides under `docs/database/`.
- Local dev intentionally bypasses RLS, so RLS must be tested against a remote/staging environment (see RLS Testing Guide).

## References

- `src/features/auth/components/ClerkSupabaseProvider.tsx`
- `src/shared/lib/supabase/client.ts` (`createClerkSupabaseClient`, `createDevSupabaseClient`)
- `docs/auth/CLERK_SUPABASE_INTEGRATION.md`
- `docs/database/RLS_SOLUTION_SUMMARY.md`, `docs/database/RLS_TESTING_GUIDE.md`
