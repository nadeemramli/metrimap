// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { alert_rulesOrderByRelationAggregateInputObjectSchema } from './alert_rulesOrderByRelationAggregateInput.schema';
import { evidence_itemsOrderByRelationAggregateInputObjectSchema } from './evidence_itemsOrderByRelationAggregateInput.schema';
import { metric_card_tagsOrderByRelationAggregateInputObjectSchema } from './metric_card_tagsOrderByRelationAggregateInput.schema';
import { usersOrderByWithRelationInputObjectSchema } from './usersOrderByWithRelationInput.schema';
import { projectsOrderByWithRelationInputObjectSchema } from './projectsOrderByWithRelationInput.schema';
import { tracked_metricsOrderByWithRelationInputObjectSchema } from './tracked_metricsOrderByWithRelationInput.schema';
import { node_access_grantsOrderByRelationAggregateInputObjectSchema } from './node_access_grantsOrderByRelationAggregateInput.schema';
import { relationshipsOrderByRelationAggregateInputObjectSchema } from './relationshipsOrderByRelationAggregateInput.schema';
import { strategy_impact_contractsOrderByWithRelationInputObjectSchema } from './strategy_impact_contractsOrderByWithRelationInput.schema';
import { strategy_metric_linksOrderByRelationAggregateInputObjectSchema } from './strategy_metric_linksOrderByRelationAggregateInput.schema'

export const metric_cardsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.metric_cardsOrderByWithRelationInput, Prisma.metric_cardsOrderByWithRelationInput> = z.object({
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
  tracked_metric_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  workflow: SortOrderSchema.optional(),
  z_index: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  alert_rules: z.lazy(() => alert_rulesOrderByRelationAggregateInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsOrderByRelationAggregateInputObjectSchema).optional(),
  users_metric_cards_created_byTousers: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  users_metric_cards_owner_idTousers: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsOrderByWithRelationInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsOrderByRelationAggregateInputObjectSchema).optional(),
  relationships_relationships_source_idTometric_cards: z.lazy(() => relationshipsOrderByRelationAggregateInputObjectSchema).optional(),
  relationships_relationships_target_idTometric_cards: z.lazy(() => relationshipsOrderByRelationAggregateInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsOrderByWithRelationInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const metric_cardsOrderByWithRelationInputObjectZodSchema = z.object({
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
  tracked_metric_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  workflow: SortOrderSchema.optional(),
  z_index: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  alert_rules: z.lazy(() => alert_rulesOrderByRelationAggregateInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsOrderByRelationAggregateInputObjectSchema).optional(),
  users_metric_cards_created_byTousers: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  users_metric_cards_owner_idTousers: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  tracked_metrics: z.lazy(() => tracked_metricsOrderByWithRelationInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsOrderByRelationAggregateInputObjectSchema).optional(),
  relationships_relationships_source_idTometric_cards: z.lazy(() => relationshipsOrderByRelationAggregateInputObjectSchema).optional(),
  relationships_relationships_target_idTometric_cards: z.lazy(() => relationshipsOrderByRelationAggregateInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsOrderByWithRelationInputObjectSchema).optional(),
  strategy_metric_links: z.lazy(() => strategy_metric_linksOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
