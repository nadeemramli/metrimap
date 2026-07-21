// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const relationship_historyAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.relationship_historyAvgOrderByAggregateInput, Prisma.relationship_historyAvgOrderByAggregateInput> = z.object({
  weight: SortOrderSchema.optional()
}).strict();
export const relationship_historyAvgOrderByAggregateInputObjectZodSchema = z.object({
  weight: SortOrderSchema.optional()
}).strict();
