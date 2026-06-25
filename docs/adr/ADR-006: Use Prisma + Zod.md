# ADR-006: Use Prisma + Zod for Type Safety and Validation

- **Status:** Accepted
- **Date:** 2025
- **Deciders:** Core team

## Context

Supabase (Postgres) is the source of truth for data. We want **end-to-end type safety** (DB → service → UI) and **runtime validation** of inputs, without adopting a second ORM/migration system that would compete with Supabase for schema ownership.

## Decision

Use **Prisma in schema-only mode** plus **Zod** for runtime validation:

- `prisma db pull` mirrors the Supabase schema into `src/lib/prisma/schema.prisma` (no Prisma migrations; relations stripped to discourage ORM use).
- `prisma-zod-generator` auto-generates Zod schemas under `src/lib/prisma/generated/schemas/` on `prisma generate`.
- Curated, conveniently-named schemas are re-exported from `src/shared/lib/validation/zod.ts` (e.g. `CreateUserSchema`, `UpdateProjectSchema`).
- Validation happens at the **service layer** (`src/lib/services/typed-operations.ts` exposes `validate.<entity>.create(...)`; `typed-projects.ts` / `typed-canvas.ts` wrap Supabase ops) and at boundaries (e.g. `CreateUserSchema.parse(...)` in `ClerkSupabaseProvider`).
- **Data access stays on the Supabase JS SDK** — Prisma's client is used for types only, never to query.

Refresh after DB changes with `npm run prisma:types` (= `prisma db pull && prisma generate`).

## Alternatives Considered

- **Full Prisma ORM** — Rejected: duplicates Supabase as a schema/migration authority and caused relation conflicts on `db pull`.
- **Hand-written Zod schemas** — Rejected: drift from the DB schema over time.
- **Drizzle / Kysely** — Rejected: another query layer competing with the Supabase SDK already in use.

## Consequences

- Single source of truth (Supabase); types and validators are regenerated, not hand-maintained.
- Contributors must run `npm run prisma:types` after schema changes and must not edit generated files.
- **Known stale artifacts (post feature-refactor):** the React validation hook `useTypedValidation` (`useProjectValidation`/`useProjectForm`) no longer exists, but `src/shared/components/common/TypedProjectForm.tsx` still imports it and is therefore broken. Use the `validate.*` API and the service layer instead. See the Prisma + Zod guide.

## References

- `src/lib/prisma/schema.prisma`, `src/lib/prisma/generated/schemas/`
- `src/shared/lib/validation/zod.ts`, `src/lib/services/typed-operations.ts`, `typed-projects.ts`
- `docs/database/PRISMA_ZOD_INTEGRATION_GUIDE.md`, `docs/database/PRISMA_ZOD_QUICK_REFERENCE.md`
