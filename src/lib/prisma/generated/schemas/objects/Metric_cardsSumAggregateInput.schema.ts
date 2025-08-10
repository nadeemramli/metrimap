import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Metric_cardsSumAggregateInputObjectSchema: z.ZodType<Prisma.Metric_cardsSumAggregateInputType, Prisma.Metric_cardsSumAggregateInputType> = z.object({
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional()
}).strict();
export const Metric_cardsSumAggregateInputObjectZodSchema = z.object({
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional()
}).strict();
