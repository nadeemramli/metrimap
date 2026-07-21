// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { metric_cardsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema } from './metric_cardsUpdateOneWithoutMetric_card_tagsNestedInput.schema'

export const metric_card_tagsUpdateWithoutTagsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUpdateWithoutTagsInput, Prisma.metric_card_tagsUpdateWithoutTagsInput> = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  metric_cards: z.lazy(() => metric_cardsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema).optional()
}).strict();
export const metric_card_tagsUpdateWithoutTagsInputObjectZodSchema = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  metric_cards: z.lazy(() => metric_cardsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema).optional()
}).strict();
