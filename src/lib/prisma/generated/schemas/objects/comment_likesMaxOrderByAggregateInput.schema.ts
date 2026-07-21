// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const comment_likesMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.comment_likesMaxOrderByAggregateInput, Prisma.comment_likesMaxOrderByAggregateInput> = z.object({
  comment_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const comment_likesMaxOrderByAggregateInputObjectZodSchema = z.object({
  comment_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
