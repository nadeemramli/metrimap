// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const strategy_impact_contractsSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsSumOrderByAggregateInput, Prisma.strategy_impact_contractsSumOrderByAggregateInput> = z.object({
  expected_delta_value: SortOrderSchema.optional()
}).strict();
export const strategy_impact_contractsSumOrderByAggregateInputObjectZodSchema = z.object({
  expected_delta_value: SortOrderSchema.optional()
}).strict();
