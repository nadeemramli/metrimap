// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateNestedOneWithoutMetric_card_tagsInputObjectSchema } from './tagsCreateNestedOneWithoutMetric_card_tagsInput.schema'

export const metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsCreateWithoutMetric_cardsInput, Prisma.metric_card_tagsCreateWithoutMetric_cardsInput> = z.object({
  id: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  tags: z.lazy(() => tagsCreateNestedOneWithoutMetric_card_tagsInputObjectSchema).optional()
}).strict();
export const metric_card_tagsCreateWithoutMetric_cardsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  tags: z.lazy(() => tagsCreateNestedOneWithoutMetric_card_tagsInputObjectSchema).optional()
}).strict();
