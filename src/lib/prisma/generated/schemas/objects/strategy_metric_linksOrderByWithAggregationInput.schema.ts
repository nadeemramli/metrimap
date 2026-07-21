// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { strategy_metric_linksCountOrderByAggregateInputObjectSchema } from './strategy_metric_linksCountOrderByAggregateInput.schema';
import { strategy_metric_linksMaxOrderByAggregateInputObjectSchema } from './strategy_metric_linksMaxOrderByAggregateInput.schema';
import { strategy_metric_linksMinOrderByAggregateInputObjectSchema } from './strategy_metric_linksMinOrderByAggregateInput.schema'

export const strategy_metric_linksOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksOrderByWithAggregationInput, Prisma.strategy_metric_linksOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  contract_id: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  role: SortOrderSchema.optional(),
  ref_source: SortOrderSchema.optional(),
  tracked_metric_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => strategy_metric_linksCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => strategy_metric_linksMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => strategy_metric_linksMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const strategy_metric_linksOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  contract_id: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  role: SortOrderSchema.optional(),
  ref_source: SortOrderSchema.optional(),
  tracked_metric_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => strategy_metric_linksCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => strategy_metric_linksMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => strategy_metric_linksMinOrderByAggregateInputObjectSchema).optional()
}).strict();
