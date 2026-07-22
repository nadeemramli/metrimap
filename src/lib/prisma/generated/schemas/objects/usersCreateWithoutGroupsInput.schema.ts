// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogCreateNestedManyWithoutUsersInputObjectSchema } from './changelogCreateNestedManyWithoutUsersInput.schema';
import { evidence_itemsCreateNestedManyWithoutUsers_evidence_items_created_byTousersInputObjectSchema } from './evidence_itemsCreateNestedManyWithoutUsers_evidence_items_created_byTousersInput.schema';
import { evidence_itemsCreateNestedManyWithoutUsers_evidence_items_owner_idTousersInputObjectSchema } from './evidence_itemsCreateNestedManyWithoutUsers_evidence_items_owner_idTousersInput.schema';
import { metric_cardsCreateNestedManyWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsCreateNestedManyWithoutUsers_metric_cards_created_byTousersInput.schema';
import { metric_cardsCreateNestedManyWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsCreateNestedManyWithoutUsers_metric_cards_owner_idTousersInput.schema';
import { project_collaboratorsCreateNestedManyWithoutUsersInputObjectSchema } from './project_collaboratorsCreateNestedManyWithoutUsersInput.schema';
import { projectsCreateNestedManyWithoutUsers_projects_created_byTousersInputObjectSchema } from './projectsCreateNestedManyWithoutUsers_projects_created_byTousersInput.schema';
import { projectsCreateNestedManyWithoutUsers_projects_last_modified_byTousersInputObjectSchema } from './projectsCreateNestedManyWithoutUsers_projects_last_modified_byTousersInput.schema';
import { relationshipsCreateNestedManyWithoutUsersInputObjectSchema } from './relationshipsCreateNestedManyWithoutUsersInput.schema';
import { tagsCreateNestedManyWithoutUsersInputObjectSchema } from './tagsCreateNestedManyWithoutUsersInput.schema'

export const usersCreateWithoutGroupsInputObjectSchema: z.ZodType<Prisma.usersCreateWithoutGroupsInput, Prisma.usersCreateWithoutGroupsInput> = z.object({
  id: z.string().optional(),
  email: z.string(),
  name: z.string(),
  avatar_url: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  changelog: z.lazy(() => changelogCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  evidence_items_evidence_items_created_byTousers: z.lazy(() => evidence_itemsCreateNestedManyWithoutUsers_evidence_items_created_byTousersInputObjectSchema).optional(),
  evidence_items_evidence_items_owner_idTousers: z.lazy(() => evidence_itemsCreateNestedManyWithoutUsers_evidence_items_owner_idTousersInputObjectSchema).optional(),
  metric_cards_metric_cards_created_byTousers: z.lazy(() => metric_cardsCreateNestedManyWithoutUsers_metric_cards_created_byTousersInputObjectSchema).optional(),
  metric_cards_metric_cards_owner_idTousers: z.lazy(() => metric_cardsCreateNestedManyWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  projects_projects_created_byTousers: z.lazy(() => projectsCreateNestedManyWithoutUsers_projects_created_byTousersInputObjectSchema).optional(),
  projects_projects_last_modified_byTousers: z.lazy(() => projectsCreateNestedManyWithoutUsers_projects_last_modified_byTousersInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  tags: z.lazy(() => tagsCreateNestedManyWithoutUsersInputObjectSchema).optional()
}).strict();
export const usersCreateWithoutGroupsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  email: z.string(),
  name: z.string(),
  avatar_url: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  changelog: z.lazy(() => changelogCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  evidence_items_evidence_items_created_byTousers: z.lazy(() => evidence_itemsCreateNestedManyWithoutUsers_evidence_items_created_byTousersInputObjectSchema).optional(),
  evidence_items_evidence_items_owner_idTousers: z.lazy(() => evidence_itemsCreateNestedManyWithoutUsers_evidence_items_owner_idTousersInputObjectSchema).optional(),
  metric_cards_metric_cards_created_byTousers: z.lazy(() => metric_cardsCreateNestedManyWithoutUsers_metric_cards_created_byTousersInputObjectSchema).optional(),
  metric_cards_metric_cards_owner_idTousers: z.lazy(() => metric_cardsCreateNestedManyWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  projects_projects_created_byTousers: z.lazy(() => projectsCreateNestedManyWithoutUsers_projects_created_byTousersInputObjectSchema).optional(),
  projects_projects_last_modified_byTousers: z.lazy(() => projectsCreateNestedManyWithoutUsers_projects_last_modified_byTousersInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsCreateNestedManyWithoutUsersInputObjectSchema).optional(),
  tags: z.lazy(() => tagsCreateNestedManyWithoutUsersInputObjectSchema).optional()
}).strict();
