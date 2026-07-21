// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const comment_likesCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.comment_likesCountOrderByAggregateInput, Prisma.comment_likesCountOrderByAggregateInput> = z.object({
  comment_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const comment_likesCountOrderByAggregateInputObjectZodSchema = z.object({
  comment_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
