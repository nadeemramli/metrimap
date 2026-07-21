// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Metric_valuesAvgAggregateInputObjectSchema: z.ZodType<Prisma.Metric_valuesAvgAggregateInputType, Prisma.Metric_valuesAvgAggregateInputType> = z.object({
  value: z.literal(true).optional(),
  change_percent: z.literal(true).optional()
}).strict();
export const Metric_valuesAvgAggregateInputObjectZodSchema = z.object({
  value: z.literal(true).optional(),
  change_percent: z.literal(true).optional()
}).strict();
