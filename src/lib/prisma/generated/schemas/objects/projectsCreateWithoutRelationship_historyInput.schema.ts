// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreatetagsInputObjectSchema } from './projectsCreatetagsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { alert_rulesCreateNestedManyWithoutProjectsInputObjectSchema } from './alert_rulesCreateNestedManyWithoutProjectsInput.schema';
import { canvas_nodesCreateNestedManyWithoutProjectsInputObjectSchema } from './canvas_nodesCreateNestedManyWithoutProjectsInput.schema';
import { canvas_snapshotsCreateNestedManyWithoutProjectsInputObjectSchema } from './canvas_snapshotsCreateNestedManyWithoutProjectsInput.schema';
import { changelogCreateNestedManyWithoutProjectsInputObjectSchema } from './changelogCreateNestedManyWithoutProjectsInput.schema';
import { comment_threadsCreateNestedManyWithoutProjectsInputObjectSchema } from './comment_threadsCreateNestedManyWithoutProjectsInput.schema';
import { dashboard_widgetsCreateNestedManyWithoutProjectsInputObjectSchema } from './dashboard_widgetsCreateNestedManyWithoutProjectsInput.schema';
import { evidence_itemsCreateNestedManyWithoutProjectsInputObjectSchema } from './evidence_itemsCreateNestedManyWithoutProjectsInput.schema';
import { groupsCreateNestedManyWithoutProjectsInputObjectSchema } from './groupsCreateNestedManyWithoutProjectsInput.schema';
import { metric_cardsCreateNestedManyWithoutProjectsInputObjectSchema } from './metric_cardsCreateNestedManyWithoutProjectsInput.schema';
import { project_collaboratorsCreateNestedManyWithoutProjectsInputObjectSchema } from './project_collaboratorsCreateNestedManyWithoutProjectsInput.schema';
import { usersCreateNestedOneWithoutProjects_projects_created_byTousersInputObjectSchema } from './usersCreateNestedOneWithoutProjects_projects_created_byTousersInput.schema';
import { usersCreateNestedOneWithoutProjects_projects_last_modified_byTousersInputObjectSchema } from './usersCreateNestedOneWithoutProjects_projects_last_modified_byTousersInput.schema';
import { spacesCreateNestedOneWithoutProjectsInputObjectSchema } from './spacesCreateNestedOneWithoutProjectsInput.schema';
import { relationshipsCreateNestedManyWithoutProjectsInputObjectSchema } from './relationshipsCreateNestedManyWithoutProjectsInput.schema';
import { strategy_impact_contractsCreateNestedManyWithoutProjectsInputObjectSchema } from './strategy_impact_contractsCreateNestedManyWithoutProjectsInput.schema';
import { tagsCreateNestedManyWithoutProjectsInputObjectSchema } from './tagsCreateNestedManyWithoutProjectsInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const projectsCreateWithoutRelationship_historyInputObjectSchema: z.ZodType<Prisma.projectsCreateWithoutRelationship_historyInput, Prisma.projectsCreateWithoutRelationship_historyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  tags: z.union([z.lazy(() => projectsCreatetagsInputObjectSchema), z.string().array()]).optional(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  is_public: z.boolean().optional(),
  is_starred: z.boolean().optional(),
  archived_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  workspace_id: z.string().optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  canvas_nodes: z.lazy(() => canvas_nodesCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  canvas_snapshots: z.lazy(() => canvas_snapshotsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  changelog: z.lazy(() => changelogCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  dashboard_widgets: z.lazy(() => dashboard_widgetsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  groups: z.lazy(() => groupsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  users_projects_created_byTousers: z.lazy(() => usersCreateNestedOneWithoutProjects_projects_created_byTousersInputObjectSchema),
  users_projects_last_modified_byTousers: z.lazy(() => usersCreateNestedOneWithoutProjects_projects_last_modified_byTousersInputObjectSchema).optional(),
  spaces: z.lazy(() => spacesCreateNestedOneWithoutProjectsInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  tag_records: z.lazy(() => tagsCreateNestedManyWithoutProjectsInputObjectSchema).optional()
}).strict();
export const projectsCreateWithoutRelationship_historyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  tags: z.union([z.lazy(() => projectsCreatetagsInputObjectSchema), z.string().array()]).optional(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  is_public: z.boolean().optional(),
  is_starred: z.boolean().optional(),
  archived_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  workspace_id: z.string().optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  canvas_nodes: z.lazy(() => canvas_nodesCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  canvas_snapshots: z.lazy(() => canvas_snapshotsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  changelog: z.lazy(() => changelogCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  dashboard_widgets: z.lazy(() => dashboard_widgetsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  groups: z.lazy(() => groupsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  users_projects_created_byTousers: z.lazy(() => usersCreateNestedOneWithoutProjects_projects_created_byTousersInputObjectSchema),
  users_projects_last_modified_byTousers: z.lazy(() => usersCreateNestedOneWithoutProjects_projects_last_modified_byTousersInputObjectSchema).optional(),
  spaces: z.lazy(() => spacesCreateNestedOneWithoutProjectsInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  tag_records: z.lazy(() => tagsCreateNestedManyWithoutProjectsInputObjectSchema).optional()
}).strict();
