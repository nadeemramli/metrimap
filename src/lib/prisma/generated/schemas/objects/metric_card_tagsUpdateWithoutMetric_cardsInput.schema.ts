// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { tagsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema } from './tagsUpdateOneWithoutMetric_card_tagsNestedInput.schema'

export const metric_card_tagsUpdateWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUpdateWithoutMetric_cardsInput, Prisma.metric_card_tagsUpdateWithoutMetric_cardsInput> = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  tags: z.lazy(() => tagsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema).optional()
}).strict();
export const metric_card_tagsUpdateWithoutMetric_cardsInputObjectZodSchema = z.object({
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  tags: z.lazy(() => tagsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema).optional()
}).strict();
