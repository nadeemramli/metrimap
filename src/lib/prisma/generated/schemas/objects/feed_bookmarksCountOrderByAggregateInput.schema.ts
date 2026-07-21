// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const feed_bookmarksCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.feed_bookmarksCountOrderByAggregateInput, Prisma.feed_bookmarksCountOrderByAggregateInput> = z.object({
  user_id: SortOrderSchema.optional(),
  item_key: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const feed_bookmarksCountOrderByAggregateInputObjectZodSchema = z.object({
  user_id: SortOrderSchema.optional(),
  item_key: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
