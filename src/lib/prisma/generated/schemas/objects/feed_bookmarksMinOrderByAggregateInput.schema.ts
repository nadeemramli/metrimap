// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const feed_bookmarksMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.feed_bookmarksMinOrderByAggregateInput, Prisma.feed_bookmarksMinOrderByAggregateInput> = z.object({
  user_id: SortOrderSchema.optional(),
  item_key: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const feed_bookmarksMinOrderByAggregateInputObjectZodSchema = z.object({
  user_id: SortOrderSchema.optional(),
  item_key: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
