// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const canvas_snapshotsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsUncheckedCreateInput, Prisma.canvas_snapshotsUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  canvas_id: z.string(),
  version: z.number().int(),
  title: z.string(),
  description: z.string().optional().nullable(),
  nodes: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  edges: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  groups: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  metadata: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const canvas_snapshotsUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  canvas_id: z.string(),
  version: z.number().int(),
  title: z.string(),
  description: z.string().optional().nullable(),
  nodes: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  edges: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  groups: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  metadata: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
