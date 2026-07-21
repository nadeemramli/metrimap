// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const dashboard_widgetsScalarWhereInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsScalarWhereInput, Prisma.dashboard_widgetsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema), z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema), z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  widget_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  config: z.lazy(() => JsonFilterObjectSchema).optional(),
  layout: z.lazy(() => JsonFilterObjectSchema).optional(),
  sort_index: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  group_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const dashboard_widgetsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema), z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema), z.lazy(() => dashboard_widgetsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  widget_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  config: z.lazy(() => JsonFilterObjectSchema).optional(),
  layout: z.lazy(() => JsonFilterObjectSchema).optional(),
  sort_index: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  group_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
