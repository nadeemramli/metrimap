// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.metric_bindingsUncheckedCreateWithoutConnected_accountsInput, Prisma.metric_bindingsUncheckedCreateWithoutConnected_accountsInput> = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  connector_id: z.string(),
  stream: z.string(),
  canonical_schema: z.string(),
  recipe: z.union([JsonNullValueInputSchema, jsonSchema]),
  tracked_metric_id: z.string(),
  enabled: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  connector_id: z.string(),
  stream: z.string(),
  canonical_schema: z.string(),
  recipe: z.union([JsonNullValueInputSchema, jsonSchema]),
  tracked_metric_id: z.string(),
  enabled: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
