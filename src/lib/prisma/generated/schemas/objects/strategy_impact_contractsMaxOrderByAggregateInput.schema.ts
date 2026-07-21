// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const strategy_impact_contractsMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsMaxOrderByAggregateInput, Prisma.strategy_impact_contractsMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  strategy_node_id: SortOrderSchema.optional(),
  expected_direction: SortOrderSchema.optional(),
  expected_delta_value: SortOrderSchema.optional(),
  expected_delta_unit: SortOrderSchema.optional(),
  baseline_start: SortOrderSchema.optional(),
  baseline_end: SortOrderSchema.optional(),
  measure_start: SortOrderSchema.optional(),
  measure_end: SortOrderSchema.optional(),
  baseline_is_manual: SortOrderSchema.optional(),
  confidence: SortOrderSchema.optional(),
  impact_status: SortOrderSchema.optional(),
  owner_label: SortOrderSchema.optional(),
  result_note: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const strategy_impact_contractsMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  strategy_node_id: SortOrderSchema.optional(),
  expected_direction: SortOrderSchema.optional(),
  expected_delta_value: SortOrderSchema.optional(),
  expected_delta_unit: SortOrderSchema.optional(),
  baseline_start: SortOrderSchema.optional(),
  baseline_end: SortOrderSchema.optional(),
  measure_start: SortOrderSchema.optional(),
  measure_end: SortOrderSchema.optional(),
  baseline_is_manual: SortOrderSchema.optional(),
  confidence: SortOrderSchema.optional(),
  impact_status: SortOrderSchema.optional(),
  owner_label: SortOrderSchema.optional(),
  result_note: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
