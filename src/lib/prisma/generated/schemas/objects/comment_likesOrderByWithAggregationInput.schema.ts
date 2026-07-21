// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { comment_likesCountOrderByAggregateInputObjectSchema } from './comment_likesCountOrderByAggregateInput.schema';
import { comment_likesMaxOrderByAggregateInputObjectSchema } from './comment_likesMaxOrderByAggregateInput.schema';
import { comment_likesMinOrderByAggregateInputObjectSchema } from './comment_likesMinOrderByAggregateInput.schema'

export const comment_likesOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.comment_likesOrderByWithAggregationInput, Prisma.comment_likesOrderByWithAggregationInput> = z.object({
  comment_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => comment_likesCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => comment_likesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => comment_likesMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const comment_likesOrderByWithAggregationInputObjectZodSchema = z.object({
  comment_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => comment_likesCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => comment_likesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => comment_likesMinOrderByAggregateInputObjectSchema).optional()
}).strict();
