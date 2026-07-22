// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const metric_valuesScalarWhereInputObjectSchema: z.ZodType<Prisma.metric_valuesScalarWhereInput, Prisma.metric_valuesScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => metric_valuesScalarWhereInputObjectSchema), z.lazy(() => metric_valuesScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_valuesScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_valuesScalarWhereInputObjectSchema), z.lazy(() => metric_valuesScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  period: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  value: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  change_percent: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  trend: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const metric_valuesScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => metric_valuesScalarWhereInputObjectSchema), z.lazy(() => metric_valuesScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_valuesScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_valuesScalarWhereInputObjectSchema), z.lazy(() => metric_valuesScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  period: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  value: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  change_percent: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  trend: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
