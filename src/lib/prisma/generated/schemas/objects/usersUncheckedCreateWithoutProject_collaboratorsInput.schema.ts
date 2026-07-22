// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogUncheckedCreateNestedManyWithoutUsersInputObjectSchema } from './changelogUncheckedCreateNestedManyWithoutUsersInput.schema';
import { evidence_itemsUncheckedCreateNestedManyWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsUncheckedCreateNestedManyWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsUncheckedCreateNestedManyWithoutUsers_evidence_items_owner_idTousersInputObjectSchema } from './evidence_itemsUncheckedCreateNestedManyWithoutUsers_evidence_items_owner_idTousersInput.schema';
import { groupsUncheckedCreateNestedManyWithoutUsersInputObjectSchema } from './groupsUncheckedCreateNestedManyWithoutUsersInput.schema';
import { metric_cardsUncheckedCreateNestedManyWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsUncheckedCreateNestedManyWithoutUsers_metric_cards_created_byTousersInput.schema';
import { metric_cardsUncheckedCreateNestedManyWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsUncheckedCreateNestedManyWithoutUsers_metric_cards_owner_idTousersInput.schema';
import { projectsUncheckedCreateNestedManyWithoutUsers_projects_created_byTousersInputObjectSchema } from './projectsUncheckedCreateNestedManyWithoutUsers_projects_created_byTousersInput.schema';
import { projectsUncheckedCreateNestedManyWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsUncheckedCreateNestedManyWithoutUsers_projects_last_modified_byTousersInput.schema';
import { relationshipsUncheckedCreateNestedManyWithoutUsersInputObjectSchema } from './relationshipsUncheckedCreateNestedManyWithoutUsersInput.schema';
import { tagsUncheckedCreateNestedManyWithoutUsersInputObjectSchema } from './tagsUncheckedCreateNestedManyWithoutUsersInput.schema'

export const usersUncheckedCreateWithoutProject_collaboratorsInputObjectSchema: z.ZodType<Prisma.usersUncheckedCreateWithoutProject_collaboratorsInput, Prisma.usersUncheckedCreateWithoutProject_collaboratorsInput> = z.object({
  id: z.string().optional(),
  email: z.string(),
  name: z.string(),
  avatar_url: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  changelog: z.lazy(() => changelogUncheckedCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  evidence_items_evidence_items_created_byTousers: z.lazy(() => evidence_itemsUncheckedCreateNestedManyWithoutUsers_evidence_items_created_byTousersInputObjectSchema).optional(),
  evidence_items_evidence_items_owner_idTousers: z.lazy(() => evidence_itemsUncheckedCreateNestedManyWithoutUsers_evidence_items_owner_idTousersInputObjectSchema).optional(),
  groups: z.lazy(() => groupsUncheckedCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  metric_cards_metric_cards_created_byTousers: z.lazy(() => metric_cardsUncheckedCreateNestedManyWithoutUsers_metric_cards_created_byTousersInputObjectSchema).optional(),
  metric_cards_metric_cards_owner_idTousers: z.lazy(() => metric_cardsUncheckedCreateNestedManyWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).optional(),
  projects_projects_created_byTousers: z.lazy(() => projectsUncheckedCreateNestedManyWithoutUsers_projects_created_byTousersInputObjectSchema).optional(),
  projects_projects_last_modified_byTousers: z.lazy(() => projectsUncheckedCreateNestedManyWithoutUsers_projects_last_modified_byTousersInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUncheckedCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  tags: z.lazy(() => tagsUncheckedCreateNestedManyWithoutUsersInputObjectSchema).optional()
}).strict();
export const usersUncheckedCreateWithoutProject_collaboratorsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  email: z.string(),
  name: z.string(),
  avatar_url: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  changelog: z.lazy(() => changelogUncheckedCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  evidence_items_evidence_items_created_byTousers: z.lazy(() => evidence_itemsUncheckedCreateNestedManyWithoutUsers_evidence_items_created_byTousersInputObjectSchema).optional(),
  evidence_items_evidence_items_owner_idTousers: z.lazy(() => evidence_itemsUncheckedCreateNestedManyWithoutUsers_evidence_items_owner_idTousersInputObjectSchema).optional(),
  groups: z.lazy(() => groupsUncheckedCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  metric_cards_metric_cards_created_byTousers: z.lazy(() => metric_cardsUncheckedCreateNestedManyWithoutUsers_metric_cards_created_byTousersInputObjectSchema).optional(),
  metric_cards_metric_cards_owner_idTousers: z.lazy(() => metric_cardsUncheckedCreateNestedManyWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).optional(),
  projects_projects_created_byTousers: z.lazy(() => projectsUncheckedCreateNestedManyWithoutUsers_projects_created_byTousersInputObjectSchema).optional(),
  projects_projects_last_modified_byTousers: z.lazy(() => projectsUncheckedCreateNestedManyWithoutUsers_projects_last_modified_byTousersInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsUncheckedCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  tags: z.lazy(() => tagsUncheckedCreateNestedManyWithoutUsersInputObjectSchema).optional()
}).strict();
