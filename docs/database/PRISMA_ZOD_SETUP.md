# Prisma + Zod Setup for End-to-End Type Safety

We've implemented Prisma ORM + Zod validation for end-to-end type safety without changing our Supabase database schema.

## Overview

- **Prisma**: Provides typed database client and schema introspection
- **Zod**: Runtime validation schemas auto-generated from Prisma models
- **Supabase**: Remains our source of truth (no changes to DB)

## Key Files

- `prisma/schema.prisma` - Mirrors Supabase schema for typing only
- `src/lib/validation/zod.ts` - Exports generated Zod schemas
- `src/lib/validation/examples.ts` - Usage examples

## Workflow

### 1. Update Types from Database

```bash
# Pull latest schema from Supabase and regenerate types
npm run prisma:types
```

This runs:

- `prisma db pull` - Syncs schema.prisma with Supabase
- `prisma generate` - Generates Prisma client + Zod schemas

### 2. Use in Code

```typescript
import { PrismaClient } from "@prisma/client";
import {
  CreateMetricCardSchema,
  UpdateMetricCardSchema,
} from "@/lib/validation/zod";

// Validate incoming data
const validatedCard = CreateMetricCardSchema.parse(rawData);

// Use with Prisma (fully typed)
const prisma = new PrismaClient();
const card = await prisma.metric_cards.create({
  data: validatedCard, // ✅ Type-safe
});
```

## Available Schemas

### Create Schemas (for new records)

- `CreateUserSchema`
- `CreateProjectSchema`
- `CreateMetricCardSchema`
- `CreateRelationshipSchema`
- `CreateEvidenceItemSchema`
- `CreateTagSchema`
- `CreateGroupSchema`

### Update Schemas (for modifications)

- `UpdateUserSchema`
- `UpdateProjectSchema`
- `UpdateMetricCardSchema`
- etc.

### Where Schemas (for queries/filters)

- `UserWhereSchema`
- `ProjectWhereSchema`
- `MetricCardWhereSchema`
- `RelationshipWhereSchema`

## Benefits

1. **Runtime Validation**: Zod validates data at runtime
2. **Compile-time Safety**: Prisma provides TypeScript types
3. **Single Source of Truth**: Supabase schema drives everything
4. **Auto-generated**: Schema changes auto-update types
5. **Zero Database Changes**: Works with existing Supabase setup

## Important Notes

- **Schema is for typing only** - we don't run Prisma migrations
- **Supabase remains primary** - RLS, auth, realtime still work
- **Relations removed** - prevents accidental ORM usage
- **Regenerate after schema changes** - run `npm run prisma:types`

## Troubleshooting

### Schema Conflicts

If `prisma db pull` creates relation conflicts:

1. Remove auto-generated relations from `schema.prisma`
2. Keep only scalar fields
3. Run `prisma generate`

### Missing Environment Variable

Ensure `DATABASE_URL` points to your Supabase Postgres connection string.

### Type Errors

After schema changes, restart TypeScript server and run:

```bash
npm run prisma:types
```
