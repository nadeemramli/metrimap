// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { Alert_rulesListRelationFilterObjectSchema } from './Alert_rulesListRelationFilter.schema';
import { Evidence_itemsListRelationFilterObjectSchema } from './Evidence_itemsListRelationFilter.schema';
import { Metric_card_tagsListRelationFilterObjectSchema } from './Metric_card_tagsListRelationFilter.schema';
import { UsersScalarRelationFilterObjectSchema } from './UsersScalarRelationFilter.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { UsersNullableScalarRelationFilterObjectSchema } from './UsersNullableScalarRelationFilter.schema';
import { ProjectsNullableScalarRelationFilterObjectSchema } from './ProjectsNullableScalarRelationFilter.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { Tracked_metricsNullableScalarRelationFilterObjectSchema } from './Tracked_metricsNullableScalarRelationFilter.schema';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema';
import { Node_access_grantsListRelationFilterObjectSchema } from './Node_access_grantsListRelationFilter.schema';
import { RelationshipsListRelationFilterObjectSchema } from './RelationshipsListRelationFilter.schema';
import { Strategy_impact_contractsNullableScalarRelationFilterObjectSchema } from './Strategy_impact_contractsNullableScalarRelationFilter.schema';
import { strategy_impact_contractsWhereInputObjectSchema } from './strategy_impact_contractsWhereInput.schema';
import { Strategy_metric_linksListRelationFilterObjectSchema } from './Strategy_metric_linksListRelationFilter.schema'

export const metric_cardsWhereInputObjectSchema: z.ZodType<Prisma.metric_cardsWhereInput, Prisma.metric_cardsWhereInput> = z.object({
  AND: z.union([z.lazy(() => metric_cardsWhereInputObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_cardsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_cardsWhereInputObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  category: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sub_category: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  position_x: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  position_y: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  data: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  source_type: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  formula: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  causal_factors: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  dimensions: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  owner_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  assignees: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  updated_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  workflow: z.lazy(() => JsonFilterObjectSchema).optional(),
  z_index: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  alert_rules: z.lazy(() => Alert_rulesListRelationFilterObjectSchema).optional(),
  evidence_items: z.lazy(() => Evidence_itemsListRelationFilterObjectSchema).optional(),
  metric_card_tags: z.lazy(() => Metric_card_tagsListRelationFilterObjectSchema).optional(),
  users_metric_cards_created_byTousers: z.union([z.lazy(() => UsersScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  users_metric_cards_owner_idTousers: z.union([z.lazy(() => UsersNullableScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional().nullable(),
  projects: z.union([z.lazy(() => ProjectsNullableScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional().nullable(),
  tracked_metrics: z.union([z.lazy(() => Tracked_metricsNullableScalarRelationFilterObjectSchema), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional().nullable(),
  node_access_grants: z.lazy(() => Node_access_grantsListRelationFilterObjectSchema).optional(),
  relationships_relationships_source_idTometric_cards: z.lazy(() => RelationshipsListRelationFilterObjectSchema).optional(),
  relationships_relationships_target_idTometric_cards: z.lazy(() => RelationshipsListRelationFilterObjectSchema).optional(),
  strategy_impact_contracts: z.union([z.lazy(() => Strategy_impact_contractsNullableScalarRelationFilterObjectSchema), z.lazy(() => strategy_impact_contractsWhereInputObjectSchema)]).optional().nullable(),
  strategy_metric_links: z.lazy(() => Strategy_metric_linksListRelationFilterObjectSchema).optional()
}).strict();
export const metric_cardsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => metric_cardsWhereInputObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_cardsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_cardsWhereInputObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema).array()]).optional(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  category: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sub_category: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  position_x: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  position_y: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  data: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  source_type: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  formula: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  causal_factors: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  dimensions: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  owner_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  assignees: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  tracked_metric_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  updated_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  workflow: z.lazy(() => JsonFilterObjectSchema).optional(),
  z_index: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  alert_rules: z.lazy(() => Alert_rulesListRelationFilterObjectSchema).optional(),
  evidence_items: z.lazy(() => Evidence_itemsListRelationFilterObjectSchema).optional(),
  metric_card_tags: z.lazy(() => Metric_card_tagsListRelationFilterObjectSchema).optional(),
  users_metric_cards_created_byTousers: z.union([z.lazy(() => UsersScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  users_metric_cards_owner_idTousers: z.union([z.lazy(() => UsersNullableScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional().nullable(),
  projects: z.union([z.lazy(() => ProjectsNullableScalarRelationFilterObjectSchema), z.lazy(() => projectsWhereInputObjectSchema)]).optional().nullable(),
  tracked_metrics: z.union([z.lazy(() => Tracked_metricsNullableScalarRelationFilterObjectSchema), z.lazy(() => tracked_metricsWhereInputObjectSchema)]).optional().nullable(),
  node_access_grants: z.lazy(() => Node_access_grantsListRelationFilterObjectSchema).optional(),
  relationships_relationships_source_idTometric_cards: z.lazy(() => RelationshipsListRelationFilterObjectSchema).optional(),
  relationships_relationships_target_idTometric_cards: z.lazy(() => RelationshipsListRelationFilterObjectSchema).optional(),
  strategy_impact_contracts: z.union([z.lazy(() => Strategy_impact_contractsNullableScalarRelationFilterObjectSchema), z.lazy(() => strategy_impact_contractsWhereInputObjectSchema)]).optional().nullable(),
  strategy_metric_links: z.lazy(() => Strategy_metric_linksListRelationFilterObjectSchema).optional()
}).strict();
