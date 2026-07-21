// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { strategy_impact_contractsUpdateOneRequiredWithoutStrategy_metric_linksNestedInputObjectSchema } from './strategy_impact_contractsUpdateOneRequiredWithoutStrategy_metric_linksNestedInput.schema';
import { tracked_metricsUpdateOneWithoutStrategy_metric_linksNestedInputObjectSchema } from './tracked_metricsUpdateOneWithoutStrategy_metric_linksNestedInput.schema'

export const strategy_metric_linksUpdateWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksUpdateWithoutMetric_cardsInput, Prisma.strategy_metric_linksUpdateWithoutMetric_cardsInput> = z.object({
  workspace_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  role: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ref_source: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsUpdateOneRequiredWithoutStrategy_metric_linksNestedInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsUpdateOneWithoutStrategy_metric_linksNestedInputObjectSchema).optional()
}).strict();
export const strategy_metric_linksUpdateWithoutMetric_cardsInputObjectZodSchema = z.object({
  workspace_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  role: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ref_source: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsUpdateOneRequiredWithoutStrategy_metric_linksNestedInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsUpdateOneWithoutStrategy_metric_linksNestedInputObjectSchema).optional()
}).strict();
