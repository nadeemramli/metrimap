// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const spacesSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.spacesSumOrderByAggregateInput, Prisma.spacesSumOrderByAggregateInput> = z.object({
  sort_order: SortOrderSchema.optional()
}).strict();
export const spacesSumOrderByAggregateInputObjectZodSchema = z.object({
  sort_order: SortOrderSchema.optional()
}).strict();
