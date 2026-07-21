// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Alert_rulesFindManySchema } from '../findManyalert_rules.schema';
import { Canvas_nodesFindManySchema } from '../findManycanvas_nodes.schema';
import { Canvas_snapshotsFindManySchema } from '../findManycanvas_snapshots.schema';
import { ChangelogFindManySchema } from '../findManychangelog.schema';
import { Comment_threadsFindManySchema } from '../findManycomment_threads.schema';
import { Dashboard_widgetsFindManySchema } from '../findManydashboard_widgets.schema';
import { Evidence_itemsFindManySchema } from '../findManyevidence_items.schema';
import { GroupsFindManySchema } from '../findManygroups.schema';
import { Metric_cardsFindManySchema } from '../findManymetric_cards.schema';
import { Project_collaboratorsFindManySchema } from '../findManyproject_collaborators.schema';
import { usersArgsObjectSchema } from './usersArgs.schema';
import { spacesArgsObjectSchema } from './spacesArgs.schema';
import { Relationship_historyFindManySchema } from '../findManyrelationship_history.schema';
import { RelationshipsFindManySchema } from '../findManyrelationships.schema';
import { Strategy_impact_contractsFindManySchema } from '../findManystrategy_impact_contracts.schema';
import { TagsFindManySchema } from '../findManytags.schema';
import { projectsCountOutputTypeArgsObjectSchema } from './projectsCountOutputTypeArgs.schema'

export const projectsSelectObjectSchema: z.ZodType<Prisma.projectsSelect, Prisma.projectsSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  tags: z.boolean().optional(),
  settings: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  last_modified_by: z.boolean().optional(),
  created_by: z.boolean().optional(),
  is_public: z.boolean().optional(),
  is_starred: z.boolean().optional(),
  archived_at: z.boolean().optional(),
  space_id: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  alert_rules: z.union([z.boolean(), z.lazy(() => Alert_rulesFindManySchema)]).optional(),
  canvas_nodes: z.union([z.boolean(), z.lazy(() => Canvas_nodesFindManySchema)]).optional(),
  canvas_snapshots: z.union([z.boolean(), z.lazy(() => Canvas_snapshotsFindManySchema)]).optional(),
  changelog: z.union([z.boolean(), z.lazy(() => ChangelogFindManySchema)]).optional(),
  comment_threads: z.union([z.boolean(), z.lazy(() => Comment_threadsFindManySchema)]).optional(),
  dashboard_widgets: z.union([z.boolean(), z.lazy(() => Dashboard_widgetsFindManySchema)]).optional(),
  evidence_items: z.union([z.boolean(), z.lazy(() => Evidence_itemsFindManySchema)]).optional(),
  groups: z.union([z.boolean(), z.lazy(() => GroupsFindManySchema)]).optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => Metric_cardsFindManySchema)]).optional(),
  project_collaborators: z.union([z.boolean(), z.lazy(() => Project_collaboratorsFindManySchema)]).optional(),
  users_projects_created_byTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  users_projects_last_modified_byTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  spaces: z.union([z.boolean(), z.lazy(() => spacesArgsObjectSchema)]).optional(),
  relationship_history: z.union([z.boolean(), z.lazy(() => Relationship_historyFindManySchema)]).optional(),
  relationships: z.union([z.boolean(), z.lazy(() => RelationshipsFindManySchema)]).optional(),
  strategy_impact_contracts: z.union([z.boolean(), z.lazy(() => Strategy_impact_contractsFindManySchema)]).optional(),
  tag_records: z.union([z.boolean(), z.lazy(() => TagsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => projectsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const projectsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  tags: z.boolean().optional(),
  settings: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  last_modified_by: z.boolean().optional(),
  created_by: z.boolean().optional(),
  is_public: z.boolean().optional(),
  is_starred: z.boolean().optional(),
  archived_at: z.boolean().optional(),
  space_id: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  alert_rules: z.union([z.boolean(), z.lazy(() => Alert_rulesFindManySchema)]).optional(),
  canvas_nodes: z.union([z.boolean(), z.lazy(() => Canvas_nodesFindManySchema)]).optional(),
  canvas_snapshots: z.union([z.boolean(), z.lazy(() => Canvas_snapshotsFindManySchema)]).optional(),
  changelog: z.union([z.boolean(), z.lazy(() => ChangelogFindManySchema)]).optional(),
  comment_threads: z.union([z.boolean(), z.lazy(() => Comment_threadsFindManySchema)]).optional(),
  dashboard_widgets: z.union([z.boolean(), z.lazy(() => Dashboard_widgetsFindManySchema)]).optional(),
  evidence_items: z.union([z.boolean(), z.lazy(() => Evidence_itemsFindManySchema)]).optional(),
  groups: z.union([z.boolean(), z.lazy(() => GroupsFindManySchema)]).optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => Metric_cardsFindManySchema)]).optional(),
  project_collaborators: z.union([z.boolean(), z.lazy(() => Project_collaboratorsFindManySchema)]).optional(),
  users_projects_created_byTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  users_projects_last_modified_byTousers: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  spaces: z.union([z.boolean(), z.lazy(() => spacesArgsObjectSchema)]).optional(),
  relationship_history: z.union([z.boolean(), z.lazy(() => Relationship_historyFindManySchema)]).optional(),
  relationships: z.union([z.boolean(), z.lazy(() => RelationshipsFindManySchema)]).optional(),
  strategy_impact_contracts: z.union([z.boolean(), z.lazy(() => Strategy_impact_contractsFindManySchema)]).optional(),
  tag_records: z.union([z.boolean(), z.lazy(() => TagsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => projectsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
