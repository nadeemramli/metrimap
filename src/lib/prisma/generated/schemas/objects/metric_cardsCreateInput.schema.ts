import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { metric_cardsCreatecausal_factorsInputObjectSchema } from './metric_cardsCreatecausal_factorsInput.schema';
import { metric_cardsCreatedimensionsInputObjectSchema } from './metric_cardsCreatedimensionsInput.schema';
import { metric_cardsCreateassigneesInputObjectSchema } from './metric_cardsCreateassigneesInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const metric_cardsCreateInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateInput, Prisma.metric_cardsCreateInput> = z.object({
  project_id: z.string().optional().nullable(),
  title: z.string(),
  description: z.string().optional().nullable(),
  category: z.string(),
  sub_category: z.string().optional().nullable(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  source_type: z.string().optional().nullable(),
  formula: z.string().optional().nullable(),
  causal_factors: z.union([z.lazy(() => metric_cardsCreatecausal_factorsInputObjectSchema), z.string().array()]).optional(),
  dimensions: z.union([z.lazy(() => metric_cardsCreatedimensionsInputObjectSchema), z.string().array()]).optional(),
  owner_id: z.string().optional().nullable(),
  assignees: z.union([z.lazy(() => metric_cardsCreateassigneesInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
export const metric_cardsCreateInputObjectZodSchema = z.object({
  project_id: z.string().optional().nullable(),
  title: z.string(),
  description: z.string().optional().nullable(),
  category: z.string(),
  sub_category: z.string().optional().nullable(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  data: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  source_type: z.string().optional().nullable(),
  formula: z.string().optional().nullable(),
  causal_factors: z.union([z.lazy(() => metric_cardsCreatecausal_factorsInputObjectSchema), z.string().array()]).optional(),
  dimensions: z.union([z.lazy(() => metric_cardsCreatedimensionsInputObjectSchema), z.string().array()]).optional(),
  owner_id: z.string().optional().nullable(),
  assignees: z.union([z.lazy(() => metric_cardsCreateassigneesInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
