// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsCreateManyTracked_metricsInputObjectSchema } from './metric_bindingsCreateManyTracked_metricsInput.schema'

export const metric_bindingsCreateManyTracked_metricsInputEnvelopeObjectSchema: z.ZodType<Prisma.metric_bindingsCreateManyTracked_metricsInputEnvelope, Prisma.metric_bindingsCreateManyTracked_metricsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => metric_bindingsCreateManyTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsCreateManyTracked_metricsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const metric_bindingsCreateManyTracked_metricsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => metric_bindingsCreateManyTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsCreateManyTracked_metricsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
