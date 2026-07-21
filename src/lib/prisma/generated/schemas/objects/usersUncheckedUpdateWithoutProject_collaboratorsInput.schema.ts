// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { changelogUncheckedUpdateManyWithoutUsersNestedInputObjectSchema } from './changelogUncheckedUpdateManyWithoutUsersNestedInput.schema';
import { evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_created_byTousersNestedInputObjectSchema } from './evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_created_byTousersNestedInput.schema';
import { evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_owner_idTousersNestedInputObjectSchema } from './evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_owner_idTousersNestedInput.schema';
import { groupsUncheckedUpdateManyWithoutUsersNestedInputObjectSchema } from './groupsUncheckedUpdateManyWithoutUsersNestedInput.schema';
import { metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_created_byTousersNestedInputObjectSchema } from './metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_created_byTousersNestedInput.schema';
import { metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_owner_idTousersNestedInputObjectSchema } from './metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_owner_idTousersNestedInput.schema';
import { projectsUncheckedUpdateManyWithoutUsers_projects_created_byTousersNestedInputObjectSchema } from './projectsUncheckedUpdateManyWithoutUsers_projects_created_byTousersNestedInput.schema';
import { projectsUncheckedUpdateManyWithoutUsers_projects_last_modified_byTousersNestedInputObjectSchema } from './projectsUncheckedUpdateManyWithoutUsers_projects_last_modified_byTousersNestedInput.schema';
import { relationshipsUncheckedUpdateManyWithoutUsersNestedInputObjectSchema } from './relationshipsUncheckedUpdateManyWithoutUsersNestedInput.schema';
import { tagsUncheckedUpdateManyWithoutUsersNestedInputObjectSchema } from './tagsUncheckedUpdateManyWithoutUsersNestedInput.schema'

export const usersUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema: z.ZodType<Prisma.usersUncheckedUpdateWithoutProject_collaboratorsInput, Prisma.usersUncheckedUpdateWithoutProject_collaboratorsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  avatar_url: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  changelog: z.lazy(() => changelogUncheckedUpdateManyWithoutUsersNestedInputObjectSchema).optional(),
  evidence_items_evidence_items_created_byTousers: z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_created_byTousersNestedInputObjectSchema).optional(),
  evidence_items_evidence_items_owner_idTousers: z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_owner_idTousersNestedInputObjectSchema).optional(),
  groups: z.lazy(() => groupsUncheckedUpdateManyWithoutUsersNestedInputObjectSchema).optional(),
  metric_cards_metric_cards_created_byTousers: z.lazy(() => metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_created_byTousersNestedInputObjectSchema).optional(),
  metric_cards_metric_cards_owner_idTousers: z.lazy(() => metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_owner_idTousersNestedInputObjectSchema).optional(),
  projects_projects_created_byTousers: z.lazy(() => projectsUncheckedUpdateManyWithoutUsers_projects_created_byTousersNestedInputObjectSchema).optional(),
  projects_projects_last_modified_byTousers: z.lazy(() => projectsUncheckedUpdateManyWithoutUsers_projects_last_modified_byTousersNestedInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUncheckedUpdateManyWithoutUsersNestedInputObjectSchema).optional(),
  tags: z.lazy(() => tagsUncheckedUpdateManyWithoutUsersNestedInputObjectSchema).optional()
}).strict();
export const usersUncheckedUpdateWithoutProject_collaboratorsInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  avatar_url: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  changelog: z.lazy(() => changelogUncheckedUpdateManyWithoutUsersNestedInputObjectSchema).optional(),
  evidence_items_evidence_items_created_byTousers: z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_created_byTousersNestedInputObjectSchema).optional(),
  evidence_items_evidence_items_owner_idTousers: z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutUsers_evidence_items_owner_idTousersNestedInputObjectSchema).optional(),
  groups: z.lazy(() => groupsUncheckedUpdateManyWithoutUsersNestedInputObjectSchema).optional(),
  metric_cards_metric_cards_created_byTousers: z.lazy(() => metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_created_byTousersNestedInputObjectSchema).optional(),
  metric_cards_metric_cards_owner_idTousers: z.lazy(() => metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_owner_idTousersNestedInputObjectSchema).optional(),
  projects_projects_created_byTousers: z.lazy(() => projectsUncheckedUpdateManyWithoutUsers_projects_created_byTousersNestedInputObjectSchema).optional(),
  projects_projects_last_modified_byTousers: z.lazy(() => projectsUncheckedUpdateManyWithoutUsers_projects_last_modified_byTousersNestedInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUncheckedUpdateManyWithoutUsersNestedInputObjectSchema).optional(),
  tags: z.lazy(() => tagsUncheckedUpdateManyWithoutUsersNestedInputObjectSchema).optional()
}).strict();
