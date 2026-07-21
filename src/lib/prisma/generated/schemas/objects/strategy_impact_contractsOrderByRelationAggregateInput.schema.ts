// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const strategy_impact_contractsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsOrderByRelationAggregateInput, Prisma.strategy_impact_contractsOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const strategy_impact_contractsOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
