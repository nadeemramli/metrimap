// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { projectsUpdatetagsInputObjectSchema } from './projectsUpdatetagsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { alert_rulesUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema } from './alert_rulesUncheckedUpdateManyWithoutProjectsNestedInput.schema';
import { canvas_nodesUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema } from './canvas_nodesUncheckedUpdateManyWithoutProjectsNestedInput.schema';
import { canvas_snapshotsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema } from './canvas_snapshotsUncheckedUpdateManyWithoutProjectsNestedInput.schema';
import { comment_threadsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema } from './comment_threadsUncheckedUpdateManyWithoutProjectsNestedInput.schema';
import { dashboard_widgetsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema } from './dashboard_widgetsUncheckedUpdateManyWithoutProjectsNestedInput.schema';
import { evidence_itemsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema } from './evidence_itemsUncheckedUpdateManyWithoutProjectsNestedInput.schema';
import { groupsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema } from './groupsUncheckedUpdateManyWithoutProjectsNestedInput.schema';
import { metric_cardsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema } from './metric_cardsUncheckedUpdateManyWithoutProjectsNestedInput.schema';
import { project_collaboratorsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema } from './project_collaboratorsUncheckedUpdateManyWithoutProjectsNestedInput.schema';
import { relationship_historyUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema } from './relationship_historyUncheckedUpdateManyWithoutProjectsNestedInput.schema';
import { relationshipsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema } from './relationshipsUncheckedUpdateManyWithoutProjectsNestedInput.schema';
import { strategy_impact_contractsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema } from './strategy_impact_contractsUncheckedUpdateManyWithoutProjectsNestedInput.schema';
import { tagsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema } from './tagsUncheckedUpdateManyWithoutProjectsNestedInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const projectsUncheckedUpdateWithoutChangelogInputObjectSchema: z.ZodType<Prisma.projectsUncheckedUpdateWithoutChangelogInput, Prisma.projectsUncheckedUpdateWithoutChangelogInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  tags: z.union([z.lazy(() => projectsUpdatetagsInputObjectSchema), z.string().array()]).optional(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  last_modified_by: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  is_public: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  is_starred: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  archived_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  space_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  workspace_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  canvas_nodes: z.lazy(() => canvas_nodesUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  canvas_snapshots: z.lazy(() => canvas_snapshotsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  dashboard_widgets: z.lazy(() => dashboard_widgetsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  groups: z.lazy(() => groupsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  tag_records: z.lazy(() => tagsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional()
}).strict();
export const projectsUncheckedUpdateWithoutChangelogInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  tags: z.union([z.lazy(() => projectsUpdatetagsInputObjectSchema), z.string().array()]).optional(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  last_modified_by: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  is_public: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  is_starred: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  archived_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  space_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  workspace_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  alert_rules: z.lazy(() => alert_rulesUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  canvas_nodes: z.lazy(() => canvas_nodesUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  canvas_snapshots: z.lazy(() => canvas_snapshotsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  dashboard_widgets: z.lazy(() => dashboard_widgetsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  evidence_items: z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  groups: z.lazy(() => groupsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  metric_cards: z.lazy(() => metric_cardsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  strategy_impact_contracts: z.lazy(() => strategy_impact_contractsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional(),
  tag_records: z.lazy(() => tagsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema).optional()
}).strict();
