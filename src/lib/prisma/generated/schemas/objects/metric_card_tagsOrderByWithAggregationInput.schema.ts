import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { metric_card_tagsCountOrderByAggregateInputObjectSchema } from './metric_card_tagsCountOrderByAggregateInput.schema';
import { metric_card_tagsMaxOrderByAggregateInputObjectSchema } from './metric_card_tagsMaxOrderByAggregateInput.schema';
import { metric_card_tagsMinOrderByAggregateInputObjectSchema } from './metric_card_tagsMinOrderByAggregateInput.schema'

export const metric_card_tagsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.metric_card_tagsOrderByWithAggregationInput, Prisma.metric_card_tagsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  metric_card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tag_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => metric_card_tagsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => metric_card_tagsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => metric_card_tagsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const metric_card_tagsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  metric_card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tag_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => metric_card_tagsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => metric_card_tagsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => metric_card_tagsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
