// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsCreateNestedManyWithoutTracked_metricsInputObjectSchema } from './event_definitionsCreateNestedManyWithoutTracked_metricsInput.schema';
import { metric_bindingsCreateNestedManyWithoutTracked_metricsInputObjectSchema } from './metric_bindingsCreateNestedManyWithoutTracked_metricsInput.schema';
import { metric_valuesCreateNestedManyWithoutTracked_metricsInputObjectSchema } from './metric_valuesCreateNestedManyWithoutTracked_metricsInput.schema';
import { strategy_metric_linksCreateNestedManyWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksCreateNestedManyWithoutTracked_metricsInput.schema'

export const tracked_metricsCreateWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.tracked_metricsCreateWithoutMetric_cardsInput, Prisma.tracked_metricsCreateWithoutMetric_cardsInput> = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  unit: z.string().optional().nullable(),
  formula: z.string().optional().nullable(),
  owner_label: z.string().optional().nullable(),
  state: z.string().optional(),
  origin_card_id: z.string().optional().nullable(),
  origin_project_id: z.string().optional().nullable(),
  source_kind: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable(),
  event_definitions: z.lazy(() => event_definitionsCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_values: z.lazy(() => metric_valuesCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional()
}).strict();
export const tracked_metricsCreateWithoutMetric_cardsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_by: z.string().optional(),
  name: z.string(),
  unit: z.string().optional().nullable(),
  formula: z.string().optional().nullable(),
  owner_label: z.string().optional().nullable(),
  state: z.string().optional(),
  origin_card_id: z.string().optional().nullable(),
  origin_project_id: z.string().optional().nullable(),
  source_kind: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_id: z.string().optional().nullable(),
  event_definitions: z.lazy(() => event_definitionsCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_values: z.lazy(() => metric_valuesCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional()
}).strict();
