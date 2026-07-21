// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_valuesAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.metric_valuesAvgOrderByAggregateInput, Prisma.metric_valuesAvgOrderByAggregateInput> = z.object({
  value: SortOrderSchema.optional(),
  change_percent: SortOrderSchema.optional()
}).strict();
export const metric_valuesAvgOrderByAggregateInputObjectZodSchema = z.object({
  value: SortOrderSchema.optional(),
  change_percent: SortOrderSchema.optional()
}).strict();
