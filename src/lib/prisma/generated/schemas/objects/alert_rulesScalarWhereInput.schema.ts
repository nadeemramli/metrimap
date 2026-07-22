// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const alert_rulesScalarWhereInputObjectSchema: z.ZodType<Prisma.alert_rulesScalarWhereInput, Prisma.alert_rulesScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => alert_rulesScalarWhereInputObjectSchema), z.lazy(() => alert_rulesScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => alert_rulesScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => alert_rulesScalarWhereInputObjectSchema), z.lazy(() => alert_rulesScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  card_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  rule_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  config: z.lazy(() => JsonFilterObjectSchema).optional(),
  enabled: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  last_triggered_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  last_triggered_value: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const alert_rulesScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => alert_rulesScalarWhereInputObjectSchema), z.lazy(() => alert_rulesScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => alert_rulesScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => alert_rulesScalarWhereInputObjectSchema), z.lazy(() => alert_rulesScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  project_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  card_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  rule_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  config: z.lazy(() => JsonFilterObjectSchema).optional(),
  enabled: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  last_triggered_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  last_triggered_value: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
