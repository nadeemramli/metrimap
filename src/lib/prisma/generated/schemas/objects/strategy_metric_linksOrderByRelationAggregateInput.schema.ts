// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const strategy_metric_linksOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksOrderByRelationAggregateInput, Prisma.strategy_metric_linksOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const strategy_metric_linksOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
