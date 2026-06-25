# Prisma + Zod Integration Guide

The complete guide to end-to-end type safety and runtime validation in Metrimap. This is the **canonical** reference; the [Quick Reference](./PRISMA_ZOD_QUICK_REFERENCE.md) is a cheat sheet derived from it.

> Decision & rationale: [ADR-006](../adr/ADR-006:%20Use%20Prisma%20+%20Zod.md).

## Overview

- **Supabase (Postgres) is the source of truth.** We do **not** run Prisma migrations.
- **Prisma** is used in *schema-only* mode: `prisma db pull` mirrors the DB into a schema; its generated client gives us **types**.
- **Zod** schemas are **auto-generated from the Prisma schema** (via `prisma-zod-generator`) and used for **runtime validation**.
- **Data access stays on the Supabase JS SDK** — Prisma never queries the database.

```
Supabase DB
  │ prisma db pull
  ▼
src/lib/prisma/schema.prisma   (mirror, do not hand-edit)
  │ prisma generate
  ├── Prisma client            → TypeScript types
  └── Zod schemas              → runtime validation
        │ re-exported via
        ▼
src/shared/lib/validation/zod.ts
        │ consumed by
        ▼
src/lib/services/typed-*.ts    (validate + Supabase operations)
        ▼
React components / boundaries (e.g. ClerkSupabaseProvider)
```

## File map (current paths)

| Purpose | Path |
|---------|------|
| Schema mirror (read-only) | `src/lib/prisma/schema.prisma` |
| Generated Zod schemas | `src/lib/prisma/generated/schemas/` (objects under `…/objects/`) |
| Curated schema re-exports | `src/shared/lib/validation/zod.ts` |
| Core validation API | `src/lib/services/typed-operations.ts` |
| Project operations | `src/lib/services/typed-projects.ts` |
| Canvas operations | `src/lib/services/typed-canvas.ts` |

> ⚠️ **Do not hand-edit** `src/lib/prisma/schema.prisma` or anything under `src/lib/prisma/generated/` — they are regenerated. The files you edit are `zod.ts` (to expose new schemas) and your services/components.

## Commands

```bash
npm run prisma:types     # db pull + generate (use after any DB schema change)
npm run prisma:pull      # sync schema.prisma from Supabase only
npm run prisma:generate  # regenerate Prisma client + Zod schemas only
```

## Types

```typescript
// Database row types — exact schema match (Prisma client, types only)
import type {
  users as User,
  projects as Project,
  metric_cards as MetricCard,
} from "@prisma/client";

// Validated input types — inferred from the Zod schemas
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/lib/services/typed-operations";
```

## Validation layer

The core API lives in `typed-operations.ts`. `ValidationResult<T>` is `{ success: boolean; data?: T; errors?: ZodIssue[] }`.

```typescript
import { validate } from "@/lib/services/typed-operations";

const result = validate.project.create(unknownData);
if (result.success) {
  result.data;        // fully typed CreateProjectInput
} else {
  result.errors;      // ZodIssue[] — each has .path and .message
}
```

Available validators (each with `.create`, `.update`, and — where applicable — `.where`):

`validate.user`, `validate.project`, `validate.metricCard`, `validate.relationship`, `validate.evidenceItem`, `validate.group`.

For one-off boundary checks you can also use a schema directly:

```typescript
import { CreateUserSchema } from "@/shared/lib/validation/zod";
CreateUserSchema.parse({ email, name, avatar_url }); // throws on invalid
```

## Service layer (recommended)

Service functions validate **and** perform the Supabase operation, returning a uniform result. They accept an optional **authenticated Supabase client** — pass the Clerk-authenticated client (see [ADR-002](../adr/ADR-002:%20Using%20Clerk%20for%20User%20Management.md)) so the call runs under the user's RLS context.

```typescript
import { createProject, updateProject } from "@/lib/services/typed-projects";

// Returns { success: boolean; project?: Project; errors?: string[] }
const result = await createProject(
  { name: "My Project", description: "..." },
  authenticatedClient // optional; omit to use the default client
);

if (result.success) {
  console.log("Created:", result.project!.name);
} else {
  console.error(result.errors); // human-readable "path: message" strings
}
```

Canvas operations follow the same pattern via `typed-canvas.ts`.

## Using validation in React

There is **no validation hook** in the codebase today (see the warning below). Validate in event handlers using the service layer or the `validate` API:

```tsx
function ProjectForm({ client }: { client?: SupabaseClient }) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState<string[]>([]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createProject(form, client);
    if (!result.success) {
      setErrors(result.errors ?? []);
      return;
    }
    // success — result.project is typed
  };

  return (/* inputs bound to form; render errors */);
}
```

> ℹ️ **History:** there used to be a `useTypedValidation` hook (`useProjectForm` / `useProjectValidation`) and a `TypedProjectForm.tsx` example component. The hook was removed in the feature-structure refactor, which left the component broken, so **both have since been deleted**. Older docs that showed `useProjectValidation().create` described that removed hook. Use the patterns above (service layer / `validate.*`); if you want a reusable form hook, add one intentionally.

## Best practices

1. **Always validate untrusted input** before it reaches Supabase — via the service layer or `validate.*`.
2. **Prefer the service layer** over calling Supabase + validating by hand; it keeps the contract uniform.
3. **Pass the authenticated client** to service functions so writes run under the correct RLS identity.
4. **Surface field-level errors** to users (`errors` carries `path` + `message`).
5. **Regenerate after DB changes** (`npm run prisma:types`) and restart the TS server.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Types don't match the database | `npm run prisma:types`, then restart the TS server |
| `prisma db pull` introduces relation conflicts | Keep scalar fields only; relations are intentionally stripped to prevent ORM use |
| "Schema/type doesn't exist" | Re-export it from `src/shared/lib/validation/zod.ts`; run `prisma:generate` |
| Validation always fails | Inspect `src/lib/prisma/generated/schemas/objects/<Model>*.schema.ts`; check required vs optional and field names |
| Missing `DATABASE_URL` | Point it at the Supabase Postgres connection string (used only by `prisma db pull`) |

## Performance notes

- Zod schemas are **pre-generated**, not built at runtime — validation overhead is minimal.
- The Prisma client is bundled for **types only**; it issues no queries.
- Existing Supabase operations are unchanged — the typed layer wraps them.

## References

- [ADR-006: Use Prisma + Zod](../adr/ADR-006:%20Use%20Prisma%20+%20Zod.md)
- [Quick Reference](./PRISMA_ZOD_QUICK_REFERENCE.md)
- `src/lib/services/typed-operations.ts`, `typed-projects.ts`, `typed-canvas.ts`
