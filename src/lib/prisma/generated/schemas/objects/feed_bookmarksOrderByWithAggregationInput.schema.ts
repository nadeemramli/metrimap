// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { feed_bookmarksCountOrderByAggregateInputObjectSchema } from './feed_bookmarksCountOrderByAggregateInput.schema';
import { feed_bookmarksMaxOrderByAggregateInputObjectSchema } from './feed_bookmarksMaxOrderByAggregateInput.schema';
import { feed_bookmarksMinOrderByAggregateInputObjectSchema } from './feed_bookmarksMinOrderByAggregateInput.schema'

export const feed_bookmarksOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.feed_bookmarksOrderByWithAggregationInput, Prisma.feed_bookmarksOrderByWithAggregationInput> = z.object({
  user_id: SortOrderSchema.optional(),
  item_key: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => feed_bookmarksCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => feed_bookmarksMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => feed_bookmarksMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const feed_bookmarksOrderByWithAggregationInputObjectZodSchema = z.object({
  user_id: SortOrderSchema.optional(),
  item_key: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => feed_bookmarksCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => feed_bookmarksMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => feed_bookmarksMinOrderByAggregateInputObjectSchema).optional()
}).strict();
