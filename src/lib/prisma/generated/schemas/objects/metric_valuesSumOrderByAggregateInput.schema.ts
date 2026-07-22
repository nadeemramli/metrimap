// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_valuesSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.metric_valuesSumOrderByAggregateInput, Prisma.metric_valuesSumOrderByAggregateInput> = z.object({
  value: SortOrderSchema.optional(),
  change_percent: SortOrderSchema.optional()
}).strict();
export const metric_valuesSumOrderByAggregateInputObjectZodSchema = z.object({
  value: SortOrderSchema.optional(),
  change_percent: SortOrderSchema.optional()
}).strict();
