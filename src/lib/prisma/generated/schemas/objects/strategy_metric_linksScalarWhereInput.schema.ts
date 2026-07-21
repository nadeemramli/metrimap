// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const strategy_metric_linksScalarWhereInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksScalarWhereInput, Prisma.strategy_metric_linksScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema), z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema), z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  contract_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  role: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ref_source: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const strategy_metric_linksScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema), z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema), z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  contract_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  role: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ref_source: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
