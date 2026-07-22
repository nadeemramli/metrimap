// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksCreateManyMetric_cardsInputObjectSchema } from './strategy_metric_linksCreateManyMetric_cardsInput.schema'

export const strategy_metric_linksCreateManyMetric_cardsInputEnvelopeObjectSchema: z.ZodType<Prisma.strategy_metric_linksCreateManyMetric_cardsInputEnvelope, Prisma.strategy_metric_linksCreateManyMetric_cardsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => strategy_metric_linksCreateManyMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateManyMetric_cardsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const strategy_metric_linksCreateManyMetric_cardsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => strategy_metric_linksCreateManyMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateManyMetric_cardsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
