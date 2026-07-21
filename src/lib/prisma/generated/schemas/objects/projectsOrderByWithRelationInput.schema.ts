// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { alert_rulesOrderByRelationAggregateInputObjectSchema } from './alert_rulesOrderByRelationAggregateInput.schema';
import { canvas_nodesOrderByRelationAggregateInputObjectSchema } from './canvas_nodesOrderByRelationAggregateInput.schema';
import { canvas_snapshotsOrderByRelationAggregateInputObjectSchema } from './canvas_snapshotsOrderByRelationAggregateInput.schema';
import { changelogOrderByRelationAggregateInputObjectSchema } from './changelogOrderByRelationAggregateInput.schema';
import { comment_threadsOrderByRelationAggregateInputObjectSchema } from './comment_threadsOrderByRelationAggregateInput.schema';
import { dashboard_widgetsOrderByRelationAggregateInputObjectSchema } from './dashboard_widgetsOrderByRelationAggregateInput.schema';
import { evidence_itemsOrderByRelationAggregateInputObjectSchema } from './evidence_itemsOrderByRelationAggregateInput.schema';
import { groupsOrderByRelationAggregateInputObjectSchema } from './groupsOrderByRelationAggregateInput.schema';
import { metric_cardsOrderByRelationAggregateInputObjectSchema } from './metric_cardsOrderByRelationAggregateInput.schema';
import { project_collaboratorsOrderByRelationAggregateInputObjectSchema } from './project_collaboratorsOrderByRelationAggregateInput.schema';
import { usersOrderByWithRelationInputObjectSchema } from './usersOrderByWithRelationInput.schema';
import { spacesOrderByWithRelationInputObjectSchema } from './spacesOrderByWithRelationInput.schema';
import { relationship_historyOrderByRelationAggregateInputObjectSchema } from './relationship_historyOrderByRelationAggregateInput.schema';
import { relationshipsOrderByRelationAggregateInputObjectSchema } from './relationshipsOrderByRelationAggregateInput.schema';
import { strategy_impact_contractsOrderByRelationAggregateInputObjectSchema } from './strategy_impact_contractsOrderByRelationAggregateInput.schema';
import { tagsOrderByRelationAggregateInputObjectSchema } from './tagsOrderByRelationAggregateInput.schema'

export const projectsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.projectsOrderByWithRelationInput, Prisma.projectsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tags: SortOrderSchema.optional(),
  settings: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_modified_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  is_public: SortOrderSchema.optional(),
  is_starred: SortOrderSchema.optional(),
  archived_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  space_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  alert_rules: z.lazy(() => alert_rulesOrderByRelationAggregateInputObjectSchema).optional(),
  canvas_nodes: z.lazy(() => canvas_nodesOrderByRelationAggregateInputObjectSchema).optional(),
  canvas_snapshots: z.lazy(() => canvas_snapshotsOrderByRelationAggregateInputObjectSchema).optional(),
  changelog: z.lazy(() => changelogOrderByRelationAggregateInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsOrderByRelationAggregateInputObjectSchema).optional(),
  dashboard_widgets: z.lazy(() => dashboard_widgetsOrderByRelationAggregateInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsOrderByRelationAggregateInputObjectSchema).optional(),
  groups: z.lazy(() => groupsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByRelationAggregateInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsOrderByRelationAggregateInputObjectSchema).optional(),
  users_projects_created_byTousers: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  users_projects_last_modified_byTousers: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  spaces: z.lazy(() => spacesOrderByWithRelationInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyOrderByRelationAggregateInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsOrderByRelationAggregateInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsOrderByRelationAggregateInputObjectSchema).optional(),
  tag_records: z.lazy(() => tagsOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const projectsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tags: SortOrderSchema.optional(),
  settings: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_modified_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  is_public: SortOrderSchema.optional(),
  is_starred: SortOrderSchema.optional(),
  archived_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  space_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  alert_rules: z.lazy(() => alert_rulesOrderByRelationAggregateInputObjectSchema).optional(),
  canvas_nodes: z.lazy(() => canvas_nodesOrderByRelationAggregateInputObjectSchema).optional(),
  canvas_snapshots: z.lazy(() => canvas_snapshotsOrderByRelationAggregateInputObjectSchema).optional(),
  changelog: z.lazy(() => changelogOrderByRelationAggregateInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsOrderByRelationAggregateInputObjectSchema).optional(),
  dashboard_widgets: z.lazy(() => dashboard_widgetsOrderByRelationAggregateInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsOrderByRelationAggregateInputObjectSchema).optional(),
  groups: z.lazy(() => groupsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByRelationAggregateInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsOrderByRelationAggregateInputObjectSchema).optional(),
  users_projects_created_byTousers: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  users_projects_last_modified_byTousers: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  spaces: z.lazy(() => spacesOrderByWithRelationInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyOrderByRelationAggregateInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsOrderByRelationAggregateInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsOrderByRelationAggregateInputObjectSchema).optional(),
  tag_records: z.lazy(() => tagsOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
