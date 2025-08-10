import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const relationshipsSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.relationshipsSumOrderByAggregateInput, Prisma.relationshipsSumOrderByAggregateInput> = z.object({
  weight: SortOrderSchema.optional()
}).strict();
export const relationshipsSumOrderByAggregateInputObjectZodSchema = z.object({
  weight: SortOrderSchema.optional()
}).strict();
