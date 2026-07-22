// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksCreateManyTracked_metricsInputObjectSchema } from './strategy_metric_linksCreateManyTracked_metricsInput.schema'

export const strategy_metric_linksCreateManyTracked_metricsInputEnvelopeObjectSchema: z.ZodType<Prisma.strategy_metric_linksCreateManyTracked_metricsInputEnvelope, Prisma.strategy_metric_linksCreateManyTracked_metricsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => strategy_metric_linksCreateManyTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateManyTracked_metricsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const strategy_metric_linksCreateManyTracked_metricsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => strategy_metric_linksCreateManyTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateManyTracked_metricsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
