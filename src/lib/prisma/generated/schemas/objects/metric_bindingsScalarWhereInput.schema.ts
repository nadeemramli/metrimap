// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const metric_bindingsScalarWhereInputObjectSchema: z.ZodType<Prisma.metric_bindingsScalarWhereInput, Prisma.metric_bindingsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => metric_bindingsScalarWhereInputObjectSchema), z.lazy(() => metric_bindingsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_bindingsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_bindingsScalarWhereInputObjectSchema), z.lazy(() => metric_bindingsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  connected_account_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  connector_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  stream: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  canonical_schema: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  recipe: z.lazy(() => JsonFilterObjectSchema).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  enabled: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const metric_bindingsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => metric_bindingsScalarWhereInputObjectSchema), z.lazy(() => metric_bindingsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_bindingsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_bindingsScalarWhereInputObjectSchema), z.lazy(() => metric_bindingsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  connected_account_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  connector_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  stream: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  canonical_schema: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  recipe: z.lazy(() => JsonFilterObjectSchema).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  enabled: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
