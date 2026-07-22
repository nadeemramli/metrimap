// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema'

export const metric_cardsScalarWhereInputObjectSchema: z.ZodType<Prisma.metric_cardsScalarWhereInput, Prisma.metric_cardsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => metric_cardsScalarWhereInputObjectSchema), z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_cardsScalarWhereInputObjectSchema), z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  category: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sub_category: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  position_x: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  position_y: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  data: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  source_type: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  formula: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  causal_factors: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  dimensions: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  owner_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  assignees: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  updated_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  workflow: z.lazy(() => JsonFilterObjectSchema).optional(),
  z_index: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable()
}).strict();
export const metric_cardsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => metric_cardsScalarWhereInputObjectSchema), z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_cardsScalarWhereInputObjectSchema), z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  category: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sub_category: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  position_x: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  position_y: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  data: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  source_type: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  formula: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  causal_factors: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  dimensions: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  owner_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  assignees: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  updated_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  workflow: z.lazy(() => JsonFilterObjectSchema).optional(),
  z_index: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable()
}).strict();
