# Prisma + Zod Quick Reference

Cheat sheet for paths, commands, and the validation API. Full details: [Integration Guide](./PRISMA_ZOD_INTEGRATION_GUIDE.md) · rationale: [ADR-006](../adr/ADR-006:%20Use%20Prisma%20+%20Zod.md).

## 📁 Key paths

```
src/lib/prisma/schema.prisma                 # schema mirror (read-only, do not edit)
src/lib/prisma/generated/schemas/objects/    # generated Zod schemas (do not edit)
src/shared/lib/validation/zod.ts             # curated schema re-exports (edit to expose new ones)
src/lib/services/typed-operations.ts         # validate.* API + types
src/lib/services/typed-projects.ts           # project ops (validate + Supabase)
src/lib/services/typed-canvas.ts             # canvas ops
```

## 🚀 Commands

```bash
npm run prisma:types      # db pull + generate (after any DB schema change)
npm run prisma:generate   # regenerate from existing schema
npm run prisma:pull       # pull schema only
```

## 🔧 Validate data

```typescript
import { validate } from "@/lib/services/typed-operations";

const r = validate.project.create(data);   // { success, data?, errors? }
if (r.success) { /* r.data is typed */ } else { /* r.errors: ZodIssue[] */ }
```

Validators: `validate.user` · `validate.project` · `validate.metricCard` · `validate.relationship` · `validate.evidenceItem` · `validate.group` — each has `.create` / `.update` / `.where`.

Direct schema (throws):

```typescript
import { CreateUserSchema } from "@/shared/lib/validation/zod";
CreateUserSchema.parse(data);
```

## ⚙️ Service operations (validate + DB)

```typescript
import { createProject, updateProject } from "@/lib/services/typed-projects";

// Returns { success, project?, errors? }; pass the authenticated client for RLS
const r = await createProject({ name: "P", description: "..." }, authenticatedClient);
if (r.success) console.log(r.project!.name);
else console.error(r.errors); // string[] of "path: message"
```

## 🧩 Types

```typescript
import type { users as User, projects as Project } from "@prisma/client";
import type { CreateProjectInput } from "@/lib/services/typed-operations";
```

## 📋 Schema names (in `zod.ts`)

- **Create:** `CreateUserSchema`, `CreateProjectSchema`, `CreateMetricCardSchema`, `CreateRelationshipSchema`, `CreateEvidenceItemSchema`, `CreateGroupSchema`
- **Update:** `UpdateUserSchema`, `UpdateProjectSchema`, `UpdateMetricCardSchema`, `UpdateRelationshipSchema`, `UpdateEvidenceItemSchema`, `UpdateGroupSchema`
- **Where:** `UserWhereSchema`, `ProjectWhereSchema`, `MetricCardWhereSchema`, `RelationshipWhereSchema`

## 🔄 Workflow

1. Change DB in Supabase → 2. `npm run prisma:types` → 3. Restart TS server → 4. Re-export new schema in `zod.ts` if needed → 5. Use `validate.*` / service layer.

## ⚠️ Gotchas

- Don't edit `schema.prisma` or `generated/` — regenerated.
- There is **no** validation hook — the old `useTypedValidation` hook and `TypedProjectForm.tsx` were removed. Validate via the service layer / `validate.*` instead.
- Local dev bypasses RLS — pass the authenticated client and test RLS on remote.
