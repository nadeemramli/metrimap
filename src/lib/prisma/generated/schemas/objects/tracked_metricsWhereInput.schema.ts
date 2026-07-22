// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { Event_definitionsListRelationFilterObjectSchema } from './Event_definitionsListRelationFilter.schema';
import { Metric_bindingsListRelationFilterObjectSchema } from './Metric_bindingsListRelationFilter.schema';
import { Metric_cardsListRelationFilterObjectSchema } from './Metric_cardsListRelationFilter.schema';
import { Metric_valuesListRelationFilterObjectSchema } from './Metric_valuesListRelationFilter.schema';
import { Strategy_metric_linksListRelationFilterObjectSchema } from './Strategy_metric_linksListRelationFilter.schema'

export const tracked_metricsWhereInputObjectSchema: z.ZodType<Prisma.tracked_metricsWhereInput, Prisma.tracked_metricsWhereInput> = z.object({
  AND: z.union([z.lazy(() => tracked_metricsWhereInputObjectSchema), z.lazy(() => tracked_metricsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tracked_metricsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tracked_metricsWhereInputObjectSchema), z.lazy(() => tracked_metricsWhereInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  unit: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  formula: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  owner_label: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  state: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  origin_card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  origin_project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source_kind: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  event_definitions: z.lazy(() => Event_definitionsListRelationFilterObjectSchema).optional(),
  metric_bindings: z.lazy(() => Metric_bindingsListRelationFilterObjectSchema).optional(),
  metric_cards: z.lazy(() => Metric_cardsListRelationFilterObjectSchema).optional(),
  metric_values: z.lazy(() => Metric_valuesListRelationFilterObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => Strategy_metric_linksListRelationFilterObjectSchema).optional()
}).strict();
export const tracked_metricsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => tracked_metricsWhereInputObjectSchema), z.lazy(() => tracked_metricsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tracked_metricsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tracked_metricsWhereInputObjectSchema), z.lazy(() => tracked_metricsWhereInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  unit: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  formula: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  owner_label: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  state: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  origin_card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  origin_project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source_kind: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  event_definitions: z.lazy(() => Event_definitionsListRelationFilterObjectSchema).optional(),
  metric_bindings: z.lazy(() => Metric_bindingsListRelationFilterObjectSchema).optional(),
  metric_cards: z.lazy(() => Metric_cardsListRelationFilterObjectSchema).optional(),
  metric_values: z.lazy(() => Metric_valuesListRelationFilterObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => Strategy_metric_linksListRelationFilterObjectSchema).optional()
}).strict();
