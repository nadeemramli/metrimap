// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Strategy_impact_contractsCountAggregateInputObjectSchema: z.ZodType<Prisma.Strategy_impact_contractsCountAggregateInputType, Prisma.Strategy_impact_contractsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  strategy_node_id: z.literal(true).optional(),
  expected_direction: z.literal(true).optional(),
  expected_delta_value: z.literal(true).optional(),
  expected_delta_unit: z.literal(true).optional(),
  baseline_start: z.literal(true).optional(),
  baseline_end: z.literal(true).optional(),
  measure_start: z.literal(true).optional(),
  measure_end: z.literal(true).optional(),
  baseline_is_manual: z.literal(true).optional(),
  confidence: z.literal(true).optional(),
  impact_status: z.literal(true).optional(),
  owner_label: z.literal(true).optional(),
  result_note: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Strategy_impact_contractsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  strategy_node_id: z.literal(true).optional(),
  expected_direction: z.literal(true).optional(),
  expected_delta_value: z.literal(true).optional(),
  expected_delta_unit: z.literal(true).optional(),
  baseline_start: z.literal(true).optional(),
  baseline_end: z.literal(true).optional(),
  measure_start: z.literal(true).optional(),
  measure_end: z.literal(true).optional(),
  baseline_is_manual: z.literal(true).optional(),
  confidence: z.literal(true).optional(),
  impact_status: z.literal(true).optional(),
  owner_label: z.literal(true).optional(),
  result_note: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
