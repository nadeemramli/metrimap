// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { metric_bindingsCountOrderByAggregateInputObjectSchema } from './metric_bindingsCountOrderByAggregateInput.schema';
import { metric_bindingsMaxOrderByAggregateInputObjectSchema } from './metric_bindingsMaxOrderByAggregateInput.schema';
import { metric_bindingsMinOrderByAggregateInputObjectSchema } from './metric_bindingsMinOrderByAggregateInput.schema'

export const metric_bindingsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.metric_bindingsOrderByWithAggregationInput, Prisma.metric_bindingsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  canonical_schema: SortOrderSchema.optional(),
  recipe: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => metric_bindingsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => metric_bindingsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => metric_bindingsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const metric_bindingsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  canonical_schema: SortOrderSchema.optional(),
  recipe: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => metric_bindingsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => metric_bindingsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => metric_bindingsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
