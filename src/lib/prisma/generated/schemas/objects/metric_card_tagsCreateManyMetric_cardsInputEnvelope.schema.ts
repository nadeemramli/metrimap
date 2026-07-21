// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsCreateManyMetric_cardsInputObjectSchema } from './metric_card_tagsCreateManyMetric_cardsInput.schema'

export const metric_card_tagsCreateManyMetric_cardsInputEnvelopeObjectSchema: z.ZodType<Prisma.metric_card_tagsCreateManyMetric_cardsInputEnvelope, Prisma.metric_card_tagsCreateManyMetric_cardsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => metric_card_tagsCreateManyMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsCreateManyMetric_cardsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const metric_card_tagsCreateManyMetric_cardsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => metric_card_tagsCreateManyMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsCreateManyMetric_cardsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
