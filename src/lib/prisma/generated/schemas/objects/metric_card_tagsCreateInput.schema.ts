// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateNestedOneWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsCreateNestedOneWithoutMetric_card_tagsInput.schema';
import { tagsCreateNestedOneWithoutMetric_card_tagsInputObjectSchema } from './tagsCreateNestedOneWithoutMetric_card_tagsInput.schema'

export const metric_card_tagsCreateInputObjectSchema: z.ZodType<Prisma.metric_card_tagsCreateInput, Prisma.metric_card_tagsCreateInput> = z.object({
  id: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  metric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutMetric_card_tagsInputObjectSchema).optional(),
  tags: z.lazy(() => tagsCreateNestedOneWithoutMetric_card_tagsInputObjectSchema).optional()
}).strict();
export const metric_card_tagsCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  metric_cards: z.lazy(() => metric_cardsCreateNestedOneWithoutMetric_card_tagsInputObjectSchema).optional(),
  tags: z.lazy(() => tagsCreateNestedOneWithoutMetric_card_tagsInputObjectSchema).optional()
}).strict();
