// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { projectsOrderByWithRelationInputObjectSchema } from './projectsOrderByWithRelationInput.schema';
import { metric_cardsOrderByWithRelationInputObjectSchema } from './metric_cardsOrderByWithRelationInput.schema';
import { strategy_metric_linksOrderByRelationAggregateInputObjectSchema } from './strategy_metric_linksOrderByRelationAggregateInput.schema'

export const strategy_impact_contractsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsOrderByWithRelationInput, Prisma.strategy_impact_contractsOrderByWithRelationInput> = z.object({
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
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const strategy_impact_contractsOrderByWithRelationInputObjectZodSchema = z.object({
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
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
