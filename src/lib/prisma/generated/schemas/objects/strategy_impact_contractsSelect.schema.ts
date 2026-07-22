// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { metric_cardsArgsObjectSchema } from './metric_cardsArgs.schema';
import { Strategy_metric_linksFindManySchema } from '../findManystrategy_metric_links.schema';
import { strategy_impact_contractsCountOutputTypeArgsObjectSchema } from './strategy_impact_contractsCountOutputTypeArgs.schema'

export const strategy_impact_contractsSelectObjectSchema: z.ZodType<Prisma.strategy_impact_contractsSelect, Prisma.strategy_impact_contractsSelect> = z.object({
  id: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  strategy_node_id: z.boolean().optional(),
  expected_direction: z.boolean().optional(),
  expected_delta_value: z.boolean().optional(),
  expected_delta_unit: z.boolean().optional(),
  baseline_start: z.boolean().optional(),
  baseline_end: z.boolean().optional(),
  measure_start: z.boolean().optional(),
  measure_end: z.boolean().optional(),
  baseline_is_manual: z.boolean().optional(),
  confidence: z.boolean().optional(),
  impact_status: z.boolean().optional(),
  owner_label: z.boolean().optional(),
  result_note: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  strategy_metric_links: z.union([z.boolean(), z.lazy(() => Strategy_metric_linksFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const strategy_impact_contractsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  strategy_node_id: z.boolean().optional(),
  expected_direction: z.boolean().optional(),
  expected_delta_value: z.boolean().optional(),
  expected_delta_unit: z.boolean().optional(),
  baseline_start: z.boolean().optional(),
  baseline_end: z.boolean().optional(),
  measure_start: z.boolean().optional(),
  measure_end: z.boolean().optional(),
  baseline_is_manual: z.boolean().optional(),
  confidence: z.boolean().optional(),
  impact_status: z.boolean().optional(),
  owner_label: z.boolean().optional(),
  result_note: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  strategy_metric_links: z.union([z.boolean(), z.lazy(() => Strategy_metric_linksFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
