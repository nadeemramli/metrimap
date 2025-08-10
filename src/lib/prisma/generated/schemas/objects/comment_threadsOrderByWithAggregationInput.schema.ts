import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { comment_threadsCountOrderByAggregateInputObjectSchema } from './comment_threadsCountOrderByAggregateInput.schema';
import { comment_threadsMaxOrderByAggregateInputObjectSchema } from './comment_threadsMaxOrderByAggregateInput.schema';
import { comment_threadsMinOrderByAggregateInputObjectSchema } from './comment_threadsMinOrderByAggregateInput.schema'

export const comment_threadsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.comment_threadsOrderByWithAggregationInput, Prisma.comment_threadsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  context: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  is_resolved: SortOrderSchema.optional(),
  created_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => comment_threadsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => comment_threadsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => comment_threadsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const comment_threadsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  context: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  is_resolved: SortOrderSchema.optional(),
  created_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => comment_threadsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => comment_threadsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => comment_threadsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
