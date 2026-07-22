// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const strategy_impact_contractsAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsAvgOrderByAggregateInput, Prisma.strategy_impact_contractsAvgOrderByAggregateInput> = z.object({
  expected_delta_value: SortOrderSchema.optional()
}).strict();
export const strategy_impact_contractsAvgOrderByAggregateInputObjectZodSchema = z.object({
  expected_delta_value: SortOrderSchema.optional()
}).strict();
