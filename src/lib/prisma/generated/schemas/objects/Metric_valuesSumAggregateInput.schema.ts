// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Metric_valuesSumAggregateInputObjectSchema: z.ZodType<Prisma.Metric_valuesSumAggregateInputType, Prisma.Metric_valuesSumAggregateInputType> = z.object({
  value: z.literal(true).optional(),
  change_percent: z.literal(true).optional()
}).strict();
export const Metric_valuesSumAggregateInputObjectZodSchema = z.object({
  value: z.literal(true).optional(),
  change_percent: z.literal(true).optional()
}).strict();
