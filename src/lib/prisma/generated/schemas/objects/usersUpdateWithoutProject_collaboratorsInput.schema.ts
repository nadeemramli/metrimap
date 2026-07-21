// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { changelogUpdateManyWithoutUsersNestedInputObjectSchema } from './changelogUpdateManyWithoutUsersNestedInput.schema';
import { evidence_itemsUpdateManyWithoutUsers_evidence_items_created_byTousersNestedInputObjectSchema } from './evidence_itemsUpdateManyWithoutUsers_evidence_items_created_byTousersNestedInput.schema';
import { evidence_itemsUpdateManyWithoutUsers_evidence_items_owner_idTousersNestedInputObjectSchema } from './evidence_itemsUpdateManyWithoutUsers_evidence_items_owner_idTousersNestedInput.schema';
import { groupsUpdateManyWithoutUsersNestedInputObjectSchema } from './groupsUpdateManyWithoutUsersNestedInput.schema';
import { metric_cardsUpdateManyWithoutUsers_metric_cards_created_byTousersNestedInputObjectSchema } from './metric_cardsUpdateManyWithoutUsers_metric_cards_created_byTousersNestedInput.schema';
import { metric_cardsUpdateManyWithoutUsers_metric_cards_owner_idTousersNestedInputObjectSchema } from './metric_cardsUpdateManyWithoutUsers_metric_cards_owner_idTousersNestedInput.schema';
import { projectsUpdateManyWithoutUsers_projects_created_byTousersNestedInputObjectSchema } from './projectsUpdateManyWithoutUsers_projects_created_byTousersNestedInput.schema';
import { projectsUpdateManyWithoutUsers_projects_last_modified_byTousersNestedInputObjectSchema } from './projectsUpdateManyWithoutUsers_projects_last_modified_byTousersNestedInput.schema';
import { relationshipsUpdateManyWithoutUsersNestedInputObjectSchema } from './relationshipsUpdateManyWithoutUsersNestedInput.schema';
import { tagsUpdateManyWithoutUsersNestedInputObjectSchema } from './tagsUpdateManyWithoutUsersNestedInput.schema'

export const usersUpdateWithoutProject_collaboratorsInputObjectSchema: z.ZodType<Prisma.usersUpdateWithoutProject_collaboratorsInput, Prisma.usersUpdateWithoutProject_collaboratorsInput> = z.object({
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  avatar_url: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  changelog: z.lazy(() => changelogUpdateManyWithoutUsersNestedInputObjectSchema).optional(),
  evidence_items_evidence_items_created_byTousers: z.lazy(() => evidence_itemsUpdateManyWithoutUsers_evidence_items_created_byTousersNestedInputObjectSchema).optional(),
  evidence_items_evidence_items_owner_idTousers: z.lazy(() => evidence_itemsUpdateManyWithoutUsers_evidence_items_owner_idTousersNestedInputObjectSchema).optional(),
  groups: z.lazy(() => groupsUpdateManyWithoutUsersNestedInputObjectSchema).optional(),
  metric_cards_metric_cards_created_byTousers: z.lazy(() => metric_cardsUpdateManyWithoutUsers_metric_cards_created_byTousersNestedInputObjectSchema).optional(),
  metric_cards_metric_cards_owner_idTousers: z.lazy(() => metric_cardsUpdateManyWithoutUsers_metric_cards_owner_idTousersNestedInputObjectSchema).optional(),
  projects_projects_created_byTousers: z.lazy(() => projectsUpdateManyWithoutUsers_projects_created_byTousersNestedInputObjectSchema).optional(),
  projects_projects_last_modified_byTousers: z.lazy(() => projectsUpdateManyWithoutUsers_projects_last_modified_byTousersNestedInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUpdateManyWithoutUsersNestedInputObjectSchema).optional(),
  tags: z.lazy(() => tagsUpdateManyWithoutUsersNestedInputObjectSchema).optional()
}).strict();
export const usersUpdateWithoutProject_collaboratorsInputObjectZodSchema = z.object({
  email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  avatar_url: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  changelog: z.lazy(() => changelogUpdateManyWithoutUsersNestedInputObjectSchema).optional(),
  evidence_items_evidence_items_created_byTousers: z.lazy(() => evidence_itemsUpdateManyWithoutUsers_evidence_items_created_byTousersNestedInputObjectSchema).optional(),
  evidence_items_evidence_items_owner_idTousers: z.lazy(() => evidence_itemsUpdateManyWithoutUsers_evidence_items_owner_idTousersNestedInputObjectSchema).optional(),
  groups: z.lazy(() => groupsUpdateManyWithoutUsersNestedInputObjectSchema).optional(),
  metric_cards_metric_cards_created_byTousers: z.lazy(() => metric_cardsUpdateManyWithoutUsers_metric_cards_created_byTousersNestedInputObjectSchema).optional(),
  metric_cards_metric_cards_owner_idTousers: z.lazy(() => metric_cardsUpdateManyWithoutUsers_metric_cards_owner_idTousersNestedInputObjectSchema).optional(),
  projects_projects_created_byTousers: z.lazy(() => projectsUpdateManyWithoutUsers_projects_created_byTousersNestedInputObjectSchema).optional(),
  projects_projects_last_modified_byTousers: z.lazy(() => projectsUpdateManyWithoutUsers_projects_last_modified_byTousersNestedInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUpdateManyWithoutUsersNestedInputObjectSchema).optional(),
  tags: z.lazy(() => tagsUpdateManyWithoutUsersNestedInputObjectSchema).optional()
}).strict();
