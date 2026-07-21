// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { metric_cardsUpdateOneWithoutStrategy_metric_linksNestedInputObjectSchema } from './metric_cardsUpdateOneWithoutStrategy_metric_linksNestedInput.schema';
import { tracked_metricsUpdateOneWithoutStrategy_metric_linksNestedInputObjectSchema } from './tracked_metricsUpdateOneWithoutStrategy_metric_linksNestedInput.schema'

export const strategy_metric_linksUpdateWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksUpdateWithoutStrategy_impact_contractsInput, Prisma.strategy_metric_linksUpdateWithoutStrategy_impact_contractsInput> = z.object({
  workspace_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  role: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ref_source: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  metric_cards: z.lazy(() => metric_cardsUpdateOneWithoutStrategy_metric_linksNestedInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsUpdateOneWithoutStrategy_metric_linksNestedInputObjectSchema).optional()
}).strict();
export const strategy_metric_linksUpdateWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  workspace_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  role: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ref_source: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  metric_cards: z.lazy(() => metric_cardsUpdateOneWithoutStrategy_metric_linksNestedInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsUpdateOneWithoutStrategy_metric_linksNestedInputObjectSchema).optional()
}).strict();
