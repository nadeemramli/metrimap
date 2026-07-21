// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateManyTracked_metricsInputObjectSchema } from './metric_cardsCreateManyTracked_metricsInput.schema'

export const metric_cardsCreateManyTracked_metricsInputEnvelopeObjectSchema: z.ZodType<Prisma.metric_cardsCreateManyTracked_metricsInputEnvelope, Prisma.metric_cardsCreateManyTracked_metricsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => metric_cardsCreateManyTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsCreateManyTracked_metricsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const metric_cardsCreateManyTracked_metricsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => metric_cardsCreateManyTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsCreateManyTracked_metricsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
