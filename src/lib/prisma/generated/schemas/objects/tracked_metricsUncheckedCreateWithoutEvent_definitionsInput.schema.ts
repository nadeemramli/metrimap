// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUncheckedCreateNestedManyWithoutTracked_metricsInput.schema';
import { metric_cardsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema } from './metric_cardsUncheckedCreateNestedManyWithoutTracked_metricsInput.schema';
import { metric_valuesUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema } from './metric_valuesUncheckedCreateNestedManyWithoutTracked_metricsInput.schema';
import { strategy_metric_linksUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksUncheckedCreateNestedManyWithoutTracked_metricsInput.schema'

export const tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectSchema: z.ZodType<Prisma.tracked_metricsUncheckedCreateWithoutEvent_definitionsInput, Prisma.tracked_metricsUncheckedCreateWithoutEvent_definitionsInput> = z.object({
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
  metric_bindings: z.lazy(() => metric_bindingsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_values: z.lazy(() => metric_valuesUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional()
}).strict();
export const tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectZodSchema = z.object({
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
  metric_bindings: z.lazy(() => metric_bindingsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_values: z.lazy(() => metric_valuesUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional()
}).strict();
