import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const commentsMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.commentsMaxOrderByAggregateInput, Prisma.commentsMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  thread_id: SortOrderSchema.optional(),
  author_id: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  resolved: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const commentsMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  thread_id: SortOrderSchema.optional(),
  author_id: SortOrderSchema.optional(),
  content: SortOrderSchema.optional(),
  resolved: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
