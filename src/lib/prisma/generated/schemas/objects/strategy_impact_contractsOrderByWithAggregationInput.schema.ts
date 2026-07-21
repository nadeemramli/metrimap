// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { strategy_impact_contractsCountOrderByAggregateInputObjectSchema } from './strategy_impact_contractsCountOrderByAggregateInput.schema';
import { strategy_impact_contractsAvgOrderByAggregateInputObjectSchema } from './strategy_impact_contractsAvgOrderByAggregateInput.schema';
import { strategy_impact_contractsMaxOrderByAggregateInputObjectSchema } from './strategy_impact_contractsMaxOrderByAggregateInput.schema';
import { strategy_impact_contractsMinOrderByAggregateInputObjectSchema } from './strategy_impact_contractsMinOrderByAggregateInput.schema';
import { strategy_impact_contractsSumOrderByAggregateInputObjectSchema } from './strategy_impact_contractsSumOrderByAggregateInput.schema'

export const strategy_impact_contractsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsOrderByWithAggregationInput, Prisma.strategy_impact_contractsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  strategy_node_id: SortOrderSchema.optional(),
  expected_direction: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  expected_delta_value: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  expected_delta_unit: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  baseline_start: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  baseline_end: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  measure_start: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  measure_end: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  baseline_is_manual: SortOrderSchema.optional(),
  confidence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  impact_status: SortOrderSchema.optional(),
  owner_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  result_note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => strategy_impact_contractsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => strategy_impact_contractsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => strategy_impact_contractsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => strategy_impact_contractsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => strategy_impact_contractsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const strategy_impact_contractsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  strategy_node_id: SortOrderSchema.optional(),
  expected_direction: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  expected_delta_value: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  expected_delta_unit: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  baseline_start: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  baseline_end: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  measure_start: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  measure_end: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  baseline_is_manual: SortOrderSchema.optional(),
  confidence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  impact_status: SortOrderSchema.optional(),
  owner_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  result_note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => strategy_impact_contractsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => strategy_impact_contractsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => strategy_impact_contractsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => strategy_impact_contractsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => strategy_impact_contractsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
