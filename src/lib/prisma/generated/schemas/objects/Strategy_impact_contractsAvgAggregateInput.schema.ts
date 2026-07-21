// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Strategy_impact_contractsAvgAggregateInputObjectSchema: z.ZodType<Prisma.Strategy_impact_contractsAvgAggregateInputType, Prisma.Strategy_impact_contractsAvgAggregateInputType> = z.object({
  expected_delta_value: z.literal(true).optional()
}).strict();
export const Strategy_impact_contractsAvgAggregateInputObjectZodSchema = z.object({
  expected_delta_value: z.literal(true).optional()
}).strict();
