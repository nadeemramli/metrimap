// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const source_connectionsSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.source_connectionsSumOrderByAggregateInput, Prisma.source_connectionsSumOrderByAggregateInput> = z.object({
  port: SortOrderSchema.optional()
}).strict();
export const source_connectionsSumOrderByAggregateInputObjectZodSchema = z.object({
  port: SortOrderSchema.optional()
}).strict();
