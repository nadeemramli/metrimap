// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { Alert_rulesListRelationFilterObjectSchema } from './Alert_rulesListRelationFilter.schema';
import { Canvas_nodesListRelationFilterObjectSchema } from './Canvas_nodesListRelationFilter.schema';
import { Canvas_snapshotsListRelationFilterObjectSchema } from './Canvas_snapshotsListRelationFilter.schema';
import { ChangelogListRelationFilterObjectSchema } from './ChangelogListRelationFilter.schema';
import { Comment_threadsListRelationFilterObjectSchema } from './Comment_threadsListRelationFilter.schema';
import { Dashboard_widgetsListRelationFilterObjectSchema } from './Dashboard_widgetsListRelationFilter.schema';
import { Evidence_itemsListRelationFilterObjectSchema } from './Evidence_itemsListRelationFilter.schema';
import { GroupsListRelationFilterObjectSchema } from './GroupsListRelationFilter.schema';
import { Metric_cardsListRelationFilterObjectSchema } from './Metric_cardsListRelationFilter.schema';
import { Project_collaboratorsListRelationFilterObjectSchema } from './Project_collaboratorsListRelationFilter.schema';
import { UsersScalarRelationFilterObjectSchema } from './UsersScalarRelationFilter.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { UsersNullableScalarRelationFilterObjectSchema } from './UsersNullableScalarRelationFilter.schema';
import { SpacesNullableScalarRelationFilterObjectSchema } from './SpacesNullableScalarRelationFilter.schema';
import { spacesWhereInputObjectSchema } from './spacesWhereInput.schema';
import { Relationship_historyListRelationFilterObjectSchema } from './Relationship_historyListRelationFilter.schema';
import { RelationshipsListRelationFilterObjectSchema } from './RelationshipsListRelationFilter.schema';
import { Strategy_impact_contractsListRelationFilterObjectSchema } from './Strategy_impact_contractsListRelationFilter.schema';
import { TagsListRelationFilterObjectSchema } from './TagsListRelationFilter.schema'

export const projectsWhereInputObjectSchema: z.ZodType<Prisma.projectsWhereInput, Prisma.projectsWhereInput> = z.object({
  AND: z.union([z.lazy(() => projectsWhereInputObjectSchema), z.lazy(() => projectsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => projectsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => projectsWhereInputObjectSchema), z.lazy(() => projectsWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  settings: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  last_modified_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  is_public: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  is_starred: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  archived_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  space_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  alert_rules: z.lazy(() => Alert_rulesListRelationFilterObjectSchema).optional(),
  canvas_nodes: z.lazy(() => Canvas_nodesListRelationFilterObjectSchema).optional(),
  canvas_snapshots: z.lazy(() => Canvas_snapshotsListRelationFilterObjectSchema).optional(),
  changelog: z.lazy(() => ChangelogListRelationFilterObjectSchema).optional(),
  comment_threads: z.lazy(() => Comment_threadsListRelationFilterObjectSchema).optional(),
  dashboard_widgets: z.lazy(() => Dashboard_widgetsListRelationFilterObjectSchema).optional(),
  evidence_items: z.lazy(() => Evidence_itemsListRelationFilterObjectSchema).optional(),
  groups: z.lazy(() => GroupsListRelationFilterObjectSchema).optional(),
  metric_cards: z.lazy(() => Metric_cardsListRelationFilterObjectSchema).optional(),
  project_collaborators: z.lazy(() => Project_collaboratorsListRelationFilterObjectSchema).optional(),
  users_projects_created_byTousers: z.union([z.lazy(() => UsersScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  users_projects_last_modified_byTousers: z.union([z.lazy(() => UsersNullableScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional().nullable(),
  spaces: z.union([z.lazy(() => SpacesNullableScalarRelationFilterObjectSchema), z.lazy(() => spacesWhereInputObjectSchema)]).optional().nullable(),
  relationship_history: z.lazy(() => Relationship_historyListRelationFilterObjectSchema).optional(),
  relationships: z.lazy(() => RelationshipsListRelationFilterObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => Strategy_impact_contractsListRelationFilterObjectSchema).optional(),
  tag_records: z.lazy(() => TagsListRelationFilterObjectSchema).optional()
}).strict();
export const projectsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => projectsWhereInputObjectSchema), z.lazy(() => projectsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => projectsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => projectsWhereInputObjectSchema), z.lazy(() => projectsWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  settings: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  last_modified_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  is_public: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  is_starred: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  archived_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  space_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  alert_rules: z.lazy(() => Alert_rulesListRelationFilterObjectSchema).optional(),
  canvas_nodes: z.lazy(() => Canvas_nodesListRelationFilterObjectSchema).optional(),
  canvas_snapshots: z.lazy(() => Canvas_snapshotsListRelationFilterObjectSchema).optional(),
  changelog: z.lazy(() => ChangelogListRelationFilterObjectSchema).optional(),
  comment_threads: z.lazy(() => Comment_threadsListRelationFilterObjectSchema).optional(),
  dashboard_widgets: z.lazy(() => Dashboard_widgetsListRelationFilterObjectSchema).optional(),
  evidence_items: z.lazy(() => Evidence_itemsListRelationFilterObjectSchema).optional(),
  groups: z.lazy(() => GroupsListRelationFilterObjectSchema).optional(),
  metric_cards: z.lazy(() => Metric_cardsListRelationFilterObjectSchema).optional(),
  project_collaborators: z.lazy(() => Project_collaboratorsListRelationFilterObjectSchema).optional(),
  users_projects_created_byTousers: z.union([z.lazy(() => UsersScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  users_projects_last_modified_byTousers: z.union([z.lazy(() => UsersNullableScalarRelationFilterObjectSchema), z.lazy(() => usersWhereInputObjectSchema)]).optional().nullable(),
  spaces: z.union([z.lazy(() => SpacesNullableScalarRelationFilterObjectSchema), z.lazy(() => spacesWhereInputObjectSchema)]).optional().nullable(),
  relationship_history: z.lazy(() => Relationship_historyListRelationFilterObjectSchema).optional(),
  relationships: z.lazy(() => RelationshipsListRelationFilterObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => Strategy_impact_contractsListRelationFilterObjectSchema).optional(),
  tag_records: z.lazy(() => TagsListRelationFilterObjectSchema).optional()
}).strict();
