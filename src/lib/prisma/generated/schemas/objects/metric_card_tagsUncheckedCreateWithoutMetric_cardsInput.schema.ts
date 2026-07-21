// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUncheckedCreateWithoutMetric_cardsInput, Prisma.metric_card_tagsUncheckedCreateWithoutMetric_cardsInput> = z.object({
  id: z.string().optional(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
export const metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
