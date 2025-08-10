import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { commentsCountOrderByAggregateInputObjectSchema } from './commentsCountOrderByAggregateInput.schema';
import { commentsMaxOrderByAggregateInputObjectSchema } from './commentsMaxOrderByAggregateInput.schema';
import { commentsMinOrderByAggregateInputObjectSchema } from './commentsMinOrderByAggregateInput.schema'

export const commentsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.commentsOrderByWithAggregationInput, Prisma.commentsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  thread_id: SortOrderSchema.optional(),
  author_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  content: SortOrderSchema.optional(),
  resolved: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => commentsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => commentsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => commentsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const commentsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  thread_id: SortOrderSchema.optional(),
  author_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  content: SortOrderSchema.optional(),
  resolved: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => commentsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => commentsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => commentsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
