// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksUncheckedCreateNestedManyWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksUncheckedCreateNestedManyWithoutStrategy_impact_contractsInput.schema'

export const strategy_impact_contractsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsUncheckedCreateInput, Prisma.strategy_impact_contractsUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  strategy_node_id: z.string(),
  expected_direction: z.string().optional().nullable(),
  expected_delta_value: z.number().optional().nullable(),
  expected_delta_unit: z.string().optional().nullable(),
  baseline_start: z.string().optional().nullable(),
  baseline_end: z.string().optional().nullable(),
  measure_start: z.string().optional().nullable(),
  measure_end: z.string().optional().nullable(),
  baseline_is_manual: z.boolean().optional(),
  confidence: z.string().optional().nullable(),
  impact_status: z.string().optional(),
  owner_label: z.string().optional().nullable(),
  result_note: z.string().optional().nullable(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksUncheckedCreateNestedManyWithoutStrategy_impact_contractsInputObjectSchema).optional()
}).strict();
export const strategy_impact_contractsUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  strategy_node_id: z.string(),
  expected_direction: z.string().optional().nullable(),
  expected_delta_value: z.number().optional().nullable(),
  expected_delta_unit: z.string().optional().nullable(),
  baseline_start: z.string().optional().nullable(),
  baseline_end: z.string().optional().nullable(),
  measure_start: z.string().optional().nullable(),
  measure_end: z.string().optional().nullable(),
  baseline_is_manual: z.boolean().optional(),
  confidence: z.string().optional().nullable(),
  impact_status: z.string().optional(),
  owner_label: z.string().optional().nullable(),
  result_note: z.string().optional().nullable(),
  created_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksUncheckedCreateNestedManyWithoutStrategy_impact_contractsInputObjectSchema).optional()
}).strict();
