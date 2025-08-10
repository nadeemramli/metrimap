import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Metric_cardsAvgAggregateInputObjectSchema: z.ZodType<Prisma.Metric_cardsAvgAggregateInputType, Prisma.Metric_cardsAvgAggregateInputType> = z.object({
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional()
}).strict();
export const Metric_cardsAvgAggregateInputObjectZodSchema = z.object({
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional()
}).strict();
