// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { projectsUpdatetagsInputObjectSchema } from './projectsUpdatetagsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { alert_rulesUpdateManyWithoutProjectsNestedInputObjectSchema } from './alert_rulesUpdateManyWithoutProjectsNestedInput.schema';
import { canvas_nodesUpdateManyWithoutProjectsNestedInputObjectSchema } from './canvas_nodesUpdateManyWithoutProjectsNestedInput.schema';
import { canvas_snapshotsUpdateManyWithoutProjectsNestedInputObjectSchema } from './canvas_snapshotsUpdateManyWithoutProjectsNestedInput.schema';
import { changelogUpdateManyWithoutProjectsNestedInputObjectSchema } from './changelogUpdateManyWithoutProjectsNestedInput.schema';
import { comment_threadsUpdateManyWithoutProjectsNestedInputObjectSchema } from './comment_threadsUpdateManyWithoutProjectsNestedInput.schema';
import { dashboard_widgetsUpdateManyWithoutProjectsNestedInputObjectSchema } from './dashboard_widgetsUpdateManyWithoutProjectsNestedInput.schema';
import { evidence_itemsUpdateManyWithoutProjectsNestedInputObjectSchema } from './evidence_itemsUpdateManyWithoutProjectsNestedInput.schema';
import { metric_cardsUpdateManyWithoutProjectsNestedInputObjectSchema } from './metric_cardsUpdateManyWithoutProjectsNestedInput.schema';
import { project_collaboratorsUpdateManyWithoutProjectsNestedInputObjectSchema } from './project_collaboratorsUpdateManyWithoutProjectsNestedInput.schema';
import { usersUpdateOneRequiredWithoutProjects_projects_created_byTousersNestedInputObjectSchema } from './usersUpdateOneRequiredWithoutProjects_projects_created_byTousersNestedInput.schema';
import { usersUpdateOneWithoutProjects_projects_last_modified_byTousersNestedInputObjectSchema } from './usersUpdateOneWithoutProjects_projects_last_modified_byTousersNestedInput.schema';
import { spacesUpdateOneWithoutProjectsNestedInputObjectSchema } from './spacesUpdateOneWithoutProjectsNestedInput.schema';
import { relationship_historyUpdateManyWithoutProjectsNestedInputObjectSchema } from './relationship_historyUpdateManyWithoutProjectsNestedInput.schema';
import { relationshipsUpdateManyWithoutProjectsNestedInputObjectSchema } from './relationshipsUpdateManyWithoutProjectsNestedInput.schema';
import { strategy_impact_contractsUpdateManyWithoutProjectsNestedInputObjectSchema } from './strategy_impact_contractsUpdateManyWithoutProjectsNestedInput.schema';
import { tagsUpdateManyWithoutProjectsNestedInputObjectSchema } from './tagsUpdateManyWithoutProjectsNestedInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const projectsUpdateWithoutGroupsInputObjectSchema: z.ZodType<Prisma.projectsUpdateWithoutGroupsInput, Prisma.projectsUpdateWithoutGroupsInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  tags: z.union([z.lazy(() => projectsUpdatetagsInputObjectSchema), z.string().array()]).optional(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  is_public: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  is_starred: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  archived_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  workspace_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  canvas_nodes: z.lazy(() => canvas_nodesUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  canvas_snapshots: z.lazy(() => canvas_snapshotsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  changelog: z.lazy(() => changelogUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  dashboard_widgets: z.lazy(() => dashboard_widgetsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  users_projects_created_byTousers: z.lazy(() => usersUpdateOneRequiredWithoutProjects_projects_created_byTousersNestedInputObjectSchema).optional(),
  users_projects_last_modified_byTousers: z.lazy(() => usersUpdateOneWithoutProjects_projects_last_modified_byTousersNestedInputObjectSchema).optional(),
  spaces: z.lazy(() => spacesUpdateOneWithoutProjectsNestedInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  tag_records: z.lazy(() => tagsUpdateManyWithoutProjectsNestedInputObjectSchema).optional()
}).strict();
export const projectsUpdateWithoutGroupsInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  tags: z.union([z.lazy(() => projectsUpdatetagsInputObjectSchema), z.string().array()]).optional(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  is_public: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  is_starred: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  archived_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  workspace_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  canvas_nodes: z.lazy(() => canvas_nodesUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  canvas_snapshots: z.lazy(() => canvas_snapshotsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  changelog: z.lazy(() => changelogUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  dashboard_widgets: z.lazy(() => dashboard_widgetsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  users_projects_created_byTousers: z.lazy(() => usersUpdateOneRequiredWithoutProjects_projects_created_byTousersNestedInputObjectSchema).optional(),
  users_projects_last_modified_byTousers: z.lazy(() => usersUpdateOneWithoutProjects_projects_last_modified_byTousersNestedInputObjectSchema).optional(),
  spaces: z.lazy(() => spacesUpdateOneWithoutProjectsNestedInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  tag_records: z.lazy(() => tagsUpdateManyWithoutProjectsNestedInputObjectSchema).optional()
}).strict();
