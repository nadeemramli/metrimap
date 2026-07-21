// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const spacesAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.spacesAvgOrderByAggregateInput, Prisma.spacesAvgOrderByAggregateInput> = z.object({
  sort_order: SortOrderSchema.optional()
}).strict();
export const spacesAvgOrderByAggregateInputObjectZodSchema = z.object({
  sort_order: SortOrderSchema.optional()
}).strict();
