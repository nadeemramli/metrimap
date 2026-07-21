// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreatetagsInputObjectSchema } from './projectsCreatetagsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { alert_rulesUncheckedCreateNestedManyWithoutProjectsInputObjectSchema } from './alert_rulesUncheckedCreateNestedManyWithoutProjectsInput.schema';
import { canvas_nodesUncheckedCreateNestedManyWithoutProjectsInputObjectSchema } from './canvas_nodesUncheckedCreateNestedManyWithoutProjectsInput.schema';
import { canvas_snapshotsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema } from './canvas_snapshotsUncheckedCreateNestedManyWithoutProjectsInput.schema';
import { changelogUncheckedCreateNestedManyWithoutProjectsInputObjectSchema } from './changelogUncheckedCreateNestedManyWithoutProjectsInput.schema';
import { comment_threadsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema } from './comment_threadsUncheckedCreateNestedManyWithoutProjectsInput.schema';
import { dashboard_widgetsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema } from './dashboard_widgetsUncheckedCreateNestedManyWithoutProjectsInput.schema';
import { evidence_itemsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema } from './evidence_itemsUncheckedCreateNestedManyWithoutProjectsInput.schema';
import { groupsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema } from './groupsUncheckedCreateNestedManyWithoutProjectsInput.schema';
import { metric_cardsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema } from './metric_cardsUncheckedCreateNestedManyWithoutProjectsInput.schema';
import { project_collaboratorsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema } from './project_collaboratorsUncheckedCreateNestedManyWithoutProjectsInput.schema';
import { relationship_historyUncheckedCreateNestedManyWithoutProjectsInputObjectSchema } from './relationship_historyUncheckedCreateNestedManyWithoutProjectsInput.schema';
import { relationshipsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema } from './relationshipsUncheckedCreateNestedManyWithoutProjectsInput.schema';
import { tagsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema } from './tagsUncheckedCreateNestedManyWithoutProjectsInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.projectsUncheckedCreateWithoutStrategy_impact_contractsInput, Prisma.projectsUncheckedCreateWithoutStrategy_impact_contractsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  tags: z.union([z.lazy(() => projectsCreatetagsInputObjectSchema), z.string().array()]).optional(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  last_modified_by: z.string().optional().nullable(),
  created_by: z.string(),
  is_public: z.boolean().optional(),
  is_starred: z.boolean().optional(),
  archived_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  space_id: z.string().optional().nullable(),
  workspace_id: z.string().optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  canvas_nodes: z.lazy(() => canvas_nodesUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  canvas_snapshots: z.lazy(() => canvas_snapshotsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  changelog: z.lazy(() => changelogUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  dashboard_widgets: z.lazy(() => dashboard_widgetsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  groups: z.lazy(() => groupsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  tag_records: z.lazy(() => tagsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional()
}).strict();
export const projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  tags: z.union([z.lazy(() => projectsCreatetagsInputObjectSchema), z.string().array()]).optional(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  last_modified_by: z.string().optional().nullable(),
  created_by: z.string(),
  is_public: z.boolean().optional(),
  is_starred: z.boolean().optional(),
  archived_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  space_id: z.string().optional().nullable(),
  workspace_id: z.string().optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  canvas_nodes: z.lazy(() => canvas_nodesUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  canvas_snapshots: z.lazy(() => canvas_snapshotsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  changelog: z.lazy(() => changelogUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  dashboard_widgets: z.lazy(() => dashboard_widgetsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  groups: z.lazy(() => groupsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional(),
  tag_records: z.lazy(() => tagsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema).optional()
}).strict();
