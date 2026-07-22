// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { Connected_accountsScalarRelationFilterObjectSchema } from './Connected_accountsScalarRelationFilter.schema';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema';
import { Tracked_metricsScalarRelationFilterObjectSchema } from './Tracked_metricsScalarRelationFilter.schema';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema'

export const metric_bindingsWhereInputObjectSchema: z.ZodType<Prisma.metric_bindingsWhereInput, Prisma.metric_bindingsWhereInput> = z.object({
  AND: z.union([z.lazy(() => metric_bindingsWhereInputObjectSchema), z.lazy(() => metric_bindingsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_bindingsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_bindingsWhereInputObjectSchema), z.lazy(() => metric_bindingsWhereInputObjectSchema).array()]).optional(),
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
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  connected_accounts: z.union([z.lazy(() => Connected_accountsScalarRelationFilterObjectSchema), z.lazy(() => connected_accountsWhereInputObjectSchema)]).optional(),
  tracked_metrics: z.union([z.lazy(() => Tracked_metricsScalarRelationFilterObjectSchema), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional()
}).strict();
export const metric_bindingsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => metric_bindingsWhereInputObjectSchema), z.lazy(() => metric_bindingsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_bindingsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_bindingsWhereInputObjectSchema), z.lazy(() => metric_bindingsWhereInputObjectSchema).array()]).optional(),
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
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  connected_accounts: z.union([z.lazy(() => Connected_accountsScalarRelationFilterObjectSchema), z.lazy(() => connected_accountsWhereInputObjectSchema)]).optional(),
  tracked_metrics: z.union([z.lazy(() => Tracked_metricsScalarRelationFilterObjectSchema), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional()
}).strict();
