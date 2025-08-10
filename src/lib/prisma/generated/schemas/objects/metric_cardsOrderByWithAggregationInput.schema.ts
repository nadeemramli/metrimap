import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { metric_cardsCountOrderByAggregateInputObjectSchema } from './metric_cardsCountOrderByAggregateInput.schema';
import { metric_cardsAvgOrderByAggregateInputObjectSchema } from './metric_cardsAvgOrderByAggregateInput.schema';
import { metric_cardsMaxOrderByAggregateInputObjectSchema } from './metric_cardsMaxOrderByAggregateInput.schema';
import { metric_cardsMinOrderByAggregateInputObjectSchema } from './metric_cardsMinOrderByAggregateInput.schema';
import { metric_cardsSumOrderByAggregateInputObjectSchema } from './metric_cardsSumOrderByAggregateInput.schema'

export const metric_cardsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.metric_cardsOrderByWithAggregationInput, Prisma.metric_cardsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  category: SortOrderSchema.optional(),
  sub_category: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  data: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_type: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  formula: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  causal_factors: SortOrderSchema.optional(),
  dimensions: SortOrderSchema.optional(),
  owner_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  assignees: SortOrderSchema.optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  _count: z.lazy(() => metric_cardsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => metric_cardsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => metric_cardsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => metric_cardsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => metric_cardsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const metric_cardsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  category: SortOrderSchema.optional(),
  sub_category: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  data: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_type: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  formula: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  causal_factors: SortOrderSchema.optional(),
  dimensions: SortOrderSchema.optional(),
  owner_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  assignees: SortOrderSchema.optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  _count: z.lazy(() => metric_cardsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => metric_cardsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => metric_cardsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => metric_cardsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => metric_cardsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
