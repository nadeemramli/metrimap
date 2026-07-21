// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { Tracked_metricsNullableScalarRelationFilterObjectSchema } from './Tracked_metricsNullableScalarRelationFilter.schema';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema';
import { Event_propertiesListRelationFilterObjectSchema } from './Event_propertiesListRelationFilter.schema'

export const event_definitionsWhereInputObjectSchema: z.ZodType<Prisma.event_definitionsWhereInput, Prisma.event_definitionsWhereInput> = z.object({
  AND: z.union([z.lazy(() => event_definitionsWhereInputObjectSchema), z.lazy(() => event_definitionsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => event_definitionsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => event_definitionsWhereInputObjectSchema), z.lazy(() => event_definitionsWhereInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  category: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  lifecycle_state: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  source_kind: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  owner_label: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tracked_metric_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  tracked_metrics: z.union([z.lazy(() => Tracked_metricsNullableScalarRelationFilterObjectSchema), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional().nullable(),
  event_properties: z.lazy(() => Event_propertiesListRelationFilterObjectSchema).optional()
}).strict();
export const event_definitionsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => event_definitionsWhereInputObjectSchema), z.lazy(() => event_definitionsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => event_definitionsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => event_definitionsWhereInputObjectSchema), z.lazy(() => event_definitionsWhereInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  category: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  lifecycle_state: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  source_kind: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  owner_label: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tracked_metric_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  tracked_metrics: z.union([z.lazy(() => Tracked_metricsNullableScalarRelationFilterObjectSchema), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional().nullable(),
  event_properties: z.lazy(() => Event_propertiesListRelationFilterObjectSchema).optional()
}).strict();
