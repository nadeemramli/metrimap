// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const relationship_historySumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.relationship_historySumOrderByAggregateInput, Prisma.relationship_historySumOrderByAggregateInput> = z.object({
  weight: SortOrderSchema.optional()
}).strict();
export const relationship_historySumOrderByAggregateInputObjectZodSchema = z.object({
  weight: SortOrderSchema.optional()
}).strict();
