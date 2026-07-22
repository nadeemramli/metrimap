// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { connected_accountsCreateNestedOneWithoutMetric_bindingsInputObjectSchema } from './connected_accountsCreateNestedOneWithoutMetric_bindingsInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const metric_bindingsCreateWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_bindingsCreateWithoutTracked_metricsInput, Prisma.metric_bindingsCreateWithoutTracked_metricsInput> = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  connector_id: z.string(),
  stream: z.string(),
  canonical_schema: z.string(),
  recipe: z.union([JsonNullValueInputSchema, jsonSchema]),
  enabled: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  connected_accounts: z.lazy(() => connected_accountsCreateNestedOneWithoutMetric_bindingsInputObjectSchema)
}).strict();
export const metric_bindingsCreateWithoutTracked_metricsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  connector_id: z.string(),
  stream: z.string(),
  canonical_schema: z.string(),
  recipe: z.union([JsonNullValueInputSchema, jsonSchema]),
  enabled: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  connected_accounts: z.lazy(() => connected_accountsCreateNestedOneWithoutMetric_bindingsInputObjectSchema)
}).strict();
