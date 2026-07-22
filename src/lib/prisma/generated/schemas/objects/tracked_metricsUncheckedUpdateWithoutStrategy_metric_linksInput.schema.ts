// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { event_definitionsUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectSchema } from './event_definitionsUncheckedUpdateManyWithoutTracked_metricsNestedInput.schema';
import { metric_bindingsUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectSchema } from './metric_bindingsUncheckedUpdateManyWithoutTracked_metricsNestedInput.schema';
import { metric_cardsUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectSchema } from './metric_cardsUncheckedUpdateManyWithoutTracked_metricsNestedInput.schema';
import { metric_valuesUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectSchema } from './metric_valuesUncheckedUpdateManyWithoutTracked_metricsNestedInput.schema'

export const tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInput, Prisma.tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
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
  event_definitions: z.lazy(() => event_definitionsUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional(),
  metric_values: z.lazy(() => metric_valuesUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional()
}).strict();
export const tracked_metricsUncheckedUpdateWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
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
  event_definitions: z.lazy(() => event_definitionsUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional(),
  metric_values: z.lazy(() => metric_valuesUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectSchema).optional()
}).strict();
