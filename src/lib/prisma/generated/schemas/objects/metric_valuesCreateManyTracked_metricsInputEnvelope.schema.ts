// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_valuesCreateManyTracked_metricsInputObjectSchema } from './metric_valuesCreateManyTracked_metricsInput.schema'

export const metric_valuesCreateManyTracked_metricsInputEnvelopeObjectSchema: z.ZodType<Prisma.metric_valuesCreateManyTracked_metricsInputEnvelope, Prisma.metric_valuesCreateManyTracked_metricsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => metric_valuesCreateManyTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesCreateManyTracked_metricsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const metric_valuesCreateManyTracked_metricsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => metric_valuesCreateManyTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesCreateManyTracked_metricsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
