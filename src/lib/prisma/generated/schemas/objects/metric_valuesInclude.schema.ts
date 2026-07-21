// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsArgsObjectSchema } from './tracked_metricsArgs.schema'

export const metric_valuesIncludeObjectSchema: z.ZodType<Prisma.metric_valuesInclude, Prisma.metric_valuesInclude> = z.object({
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional()
}).strict();
export const metric_valuesIncludeObjectZodSchema = z.object({
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional()
}).strict();
