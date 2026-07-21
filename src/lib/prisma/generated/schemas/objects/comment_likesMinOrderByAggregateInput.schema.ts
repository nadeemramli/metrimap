// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const comment_likesMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.comment_likesMinOrderByAggregateInput, Prisma.comment_likesMinOrderByAggregateInput> = z.object({
  comment_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const comment_likesMinOrderByAggregateInputObjectZodSchema = z.object({
  comment_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
