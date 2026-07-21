// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema } from './event_definitionsUncheckedCreateNestedManyWithoutTracked_metricsInput.schema';
import { metric_bindingsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUncheckedCreateNestedManyWithoutTracked_metricsInput.schema';
import { metric_cardsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema } from './metric_cardsUncheckedCreateNestedManyWithoutTracked_metricsInput.schema';
import { metric_valuesUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema } from './metric_valuesUncheckedCreateNestedManyWithoutTracked_metricsInput.schema'

export const tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInput, Prisma.tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInput> = z.object({
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
  event_definitions: z.lazy(() => event_definitionsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_values: z.lazy(() => metric_valuesUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional()
}).strict();
export const tracked_metricsUncheckedCreateWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
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
  event_definitions: z.lazy(() => event_definitionsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional(),
  metric_values: z.lazy(() => metric_valuesUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema).optional()
}).strict();
