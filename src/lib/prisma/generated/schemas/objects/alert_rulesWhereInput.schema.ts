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
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { Metric_cardsScalarRelationFilterObjectSchema } from './Metric_cardsScalarRelationFilter.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { ProjectsScalarRelationFilterObjectSchema } from './ProjectsScalarRelationFilter.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const alert_rulesWhereInputObjectSchema: z.ZodType<Prisma.alert_rulesWhereInput, Prisma.alert_rulesWhereInput> = z.object({
  AND: z.union([z.lazy(() => alert_rulesWhereInputObjectSchema), z.lazy(() => alert_rulesWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => alert_rulesWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => alert_rulesWhereInputObjectSchema), z.lazy(() => alert_rulesWhereInputObjectSchema).array()]).optional(),
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
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  metric_cards: z.union([z.lazy(() => Metric_cardsScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  projects: z.union([z.lazy(() => ProjectsScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional()
}).strict();
export const alert_rulesWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => alert_rulesWhereInputObjectSchema), z.lazy(() => alert_rulesWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => alert_rulesWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => alert_rulesWhereInputObjectSchema), z.lazy(() => alert_rulesWhereInputObjectSchema).array()]).optional(),
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
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  metric_cards: z.union([z.lazy(() => Metric_cardsScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  projects: z.union([z.lazy(() => ProjectsScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional()
}).strict();
