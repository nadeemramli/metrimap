// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { FloatNullableWithAggregatesFilterObjectSchema } from './FloatNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const alert_rulesScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.alert_rulesScalarWhereWithAggregatesInput, Prisma.alert_rulesScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => alert_rulesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => alert_rulesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => alert_rulesScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => alert_rulesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => alert_rulesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  card_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  rule_type: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  config: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  enabled: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  last_triggered_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  last_triggered_value: z.union([z.lazy(() => FloatNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const alert_rulesScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => alert_rulesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => alert_rulesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => alert_rulesScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => alert_rulesScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => alert_rulesScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  card_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  rule_type: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  config: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  enabled: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  last_triggered_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  last_triggered_value: z.union([z.lazy(() => FloatNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
