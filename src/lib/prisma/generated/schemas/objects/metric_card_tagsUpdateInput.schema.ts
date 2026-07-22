// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { metric_cardsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema } from './metric_cardsUpdateOneWithoutMetric_card_tagsNestedInput.schema';
import { tagsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema } from './tagsUpdateOneWithoutMetric_card_tagsNestedInput.schema'

export const metric_card_tagsUpdateInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUpdateInput, Prisma.metric_card_tagsUpdateInput> = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  metric_cards: z.lazy(() => metric_cardsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema).optional(),
  tags: z.lazy(() => tagsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema).optional()
}).strict();
export const metric_card_tagsUpdateInputObjectZodSchema = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  metric_cards: z.lazy(() => metric_cardsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema).optional(),
  tags: z.lazy(() => tagsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema).optional()
}).strict();
