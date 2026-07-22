// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const feed_bookmarksMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.feed_bookmarksMaxOrderByAggregateInput, Prisma.feed_bookmarksMaxOrderByAggregateInput> = z.object({
  user_id: SortOrderSchema.optional(),
  item_key: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const feed_bookmarksMaxOrderByAggregateInputObjectZodSchema = z.object({
  user_id: SortOrderSchema.optional(),
  item_key: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
