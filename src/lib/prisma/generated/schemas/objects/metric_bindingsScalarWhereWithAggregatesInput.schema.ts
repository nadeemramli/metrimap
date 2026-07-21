// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const metric_bindingsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.metric_bindingsScalarWhereWithAggregatesInput, Prisma.metric_bindingsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => metric_bindingsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => metric_bindingsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_bindingsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_bindingsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => metric_bindingsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  connected_account_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  connector_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  stream: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  canonical_schema: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  recipe: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  enabled: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const metric_bindingsScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => metric_bindingsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => metric_bindingsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_bindingsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_bindingsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => metric_bindingsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  connected_account_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  connector_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  stream: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  canonical_schema: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  recipe: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  enabled: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
