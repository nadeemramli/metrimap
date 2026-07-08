// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';

// Hand-patched (prisma:types is broken): causal_metadata jsonb — the strict
// schema predated the column, so transformToInsert's causal_metadata key threw
// unrecognized_keys on every relationship create (cf. metric_cards z_index).
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const relationshipsCreateInputObjectSchema: z.ZodType<Prisma.relationshipsCreateInput, Prisma.relationshipsCreateInput> = z.object({
  id: z.string().optional(),
  project_id: z.string().optional().nullable(),
  source_id: z.string().optional().nullable(),
  target_id: z.string().optional().nullable(),
  type: z.string(),
  confidence: z.string().optional(),
  weight: z.number().optional().nullable(),
  causal_metadata: jsonSchema.optional().nullable(),
  description: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
export const relationshipsCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  project_id: z.string().optional().nullable(),
  source_id: z.string().optional().nullable(),
  target_id: z.string().optional().nullable(),
  type: z.string(),
  confidence: z.string().optional(),
  weight: z.number().optional().nullable(),
  causal_metadata: jsonSchema.optional().nullable(),
  description: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
