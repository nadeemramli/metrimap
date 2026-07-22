// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Strategy_impact_contractsSumAggregateInputObjectSchema: z.ZodType<Prisma.Strategy_impact_contractsSumAggregateInputType, Prisma.Strategy_impact_contractsSumAggregateInputType> = z.object({
  expected_delta_value: z.literal(true).optional()
}).strict();
export const Strategy_impact_contractsSumAggregateInputObjectZodSchema = z.object({
  expected_delta_value: z.literal(true).optional()
}).strict();
