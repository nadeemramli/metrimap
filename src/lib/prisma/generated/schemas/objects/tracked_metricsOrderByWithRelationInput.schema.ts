// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { event_definitionsOrderByRelationAggregateInputObjectSchema } from './event_definitionsOrderByRelationAggregateInput.schema';
import { metric_bindingsOrderByRelationAggregateInputObjectSchema } from './metric_bindingsOrderByRelationAggregateInput.schema';
import { metric_cardsOrderByRelationAggregateInputObjectSchema } from './metric_cardsOrderByRelationAggregateInput.schema';
import { metric_valuesOrderByRelationAggregateInputObjectSchema } from './metric_valuesOrderByRelationAggregateInput.schema';
import { strategy_metric_linksOrderByRelationAggregateInputObjectSchema } from './strategy_metric_linksOrderByRelationAggregateInput.schema'

export const tracked_metricsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.tracked_metricsOrderByWithRelationInput, Prisma.tracked_metricsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  unit: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  formula: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  owner_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  state: SortOrderSchema.optional(),
  origin_card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  origin_project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_kind: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  event_definitions: z.lazy(() => event_definitionsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_values: z.lazy(() => metric_valuesOrderByRelationAggregateInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const tracked_metricsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  unit: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  formula: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  owner_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  state: SortOrderSchema.optional(),
  origin_card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  origin_project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_kind: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  event_definitions: z.lazy(() => event_definitionsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_bindings: z.lazy(() => metric_bindingsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_values: z.lazy(() => metric_valuesOrderByRelationAggregateInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
