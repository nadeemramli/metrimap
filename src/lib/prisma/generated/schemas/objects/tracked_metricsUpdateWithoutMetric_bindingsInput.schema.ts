// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { event_definitionsUpdateManyWithoutTracked_metricsNestedInputObjectSchema } from './event_definitionsUpdateManyWithoutTracked_metricsNestedInput.schema';
import { metric_cardsUpdateManyWithoutTracked_metricsNestedInputObjectSchema } from './metric_cardsUpdateManyWithoutTracked_metricsNestedInput.schema';
import { metric_valuesUpdateManyWithoutTracked_metricsNestedInputObjectSchema } from './metric_valuesUpdateManyWithoutTracked_metricsNestedInput.schema';
import { strategy_metric_linksUpdateManyWithoutTracked_metricsNestedInputObjectSchema } from './strategy_metric_linksUpdateManyWithoutTracked_metricsNestedInput.schema'

export const tracked_metricsUpdateWithoutMetric_bindingsInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpdateWithoutMetric_bindingsInput, Prisma.tracked_metricsUpdateWithoutMetric_bindingsInput> = z.object({
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  unit: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  formula: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  owner_label: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  state: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  origin_card_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  origin_project_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  source_kind: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  workspace_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  event_definitions: z.lazy(() => event_definitionsUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional(),
  metric_values: z.lazy(() => metric_valuesUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional()
}).strict();
export const tracked_metricsUpdateWithoutMetric_bindingsInputObjectZodSchema = z.object({
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  unit: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  formula: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  owner_label: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  state: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  origin_card_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  origin_project_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  source_kind: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  workspace_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  event_definitions: z.lazy(() => event_definitionsUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional(),
  metric_values: z.lazy(() => metric_valuesUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional()
}).strict();
