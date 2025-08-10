import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const comment_mentionsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.comment_mentionsCountOrderByAggregateInput, Prisma.comment_mentionsCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  comment_id: SortOrderSchema.optional(),
  mentioned_user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const comment_mentionsCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  comment_id: SortOrderSchema.optional(),
  mentioned_user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
