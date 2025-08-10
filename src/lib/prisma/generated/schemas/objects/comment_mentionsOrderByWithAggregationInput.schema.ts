import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { comment_mentionsCountOrderByAggregateInputObjectSchema } from './comment_mentionsCountOrderByAggregateInput.schema';
import { comment_mentionsMaxOrderByAggregateInputObjectSchema } from './comment_mentionsMaxOrderByAggregateInput.schema';
import { comment_mentionsMinOrderByAggregateInputObjectSchema } from './comment_mentionsMinOrderByAggregateInput.schema'

export const comment_mentionsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.comment_mentionsOrderByWithAggregationInput, Prisma.comment_mentionsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  comment_id: SortOrderSchema.optional(),
  mentioned_user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => comment_mentionsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => comment_mentionsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => comment_mentionsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const comment_mentionsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  comment_id: SortOrderSchema.optional(),
  mentioned_user_id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => comment_mentionsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => comment_mentionsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => comment_mentionsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
