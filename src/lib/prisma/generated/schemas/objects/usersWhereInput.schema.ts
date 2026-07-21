// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { ChangelogListRelationFilterObjectSchema } from './ChangelogListRelationFilter.schema';
import { Evidence_itemsListRelationFilterObjectSchema } from './Evidence_itemsListRelationFilter.schema';
import { GroupsListRelationFilterObjectSchema } from './GroupsListRelationFilter.schema';
import { Metric_cardsListRelationFilterObjectSchema } from './Metric_cardsListRelationFilter.schema';
import { Project_collaboratorsListRelationFilterObjectSchema } from './Project_collaboratorsListRelationFilter.schema';
import { ProjectsListRelationFilterObjectSchema } from './ProjectsListRelationFilter.schema';
import { RelationshipsListRelationFilterObjectSchema } from './RelationshipsListRelationFilter.schema';
import { TagsListRelationFilterObjectSchema } from './TagsListRelationFilter.schema'

export const usersWhereInputObjectSchema: z.ZodType<Prisma.usersWhereInput, Prisma.usersWhereInput> = z.object({
  AND: z.union([z.lazy(() => usersWhereInputObjectSchema), z.lazy(() => usersWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => usersWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => usersWhereInputObjectSchema), z.lazy(() => usersWhereInputObjectSchema).array()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  avatar_url: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  changelog: z.lazy(() => ChangelogListRelationFilterObjectSchema).optional(),
  evidence_items_evidence_items_created_byTousers: z.lazy(() => Evidence_itemsListRelationFilterObjectSchema).optional(),
  evidence_items_evidence_items_owner_idTousers: z.lazy(() => Evidence_itemsListRelationFilterObjectSchema).optional(),
  groups: z.lazy(() => GroupsListRelationFilterObjectSchema).optional(),
  metric_cards_metric_cards_created_byTousers: z.lazy(() => Metric_cardsListRelationFilterObjectSchema).optional(),
  metric_cards_metric_cards_owner_idTousers: z.lazy(() => Metric_cardsListRelationFilterObjectSchema).optional(),
  project_collaborators: z.lazy(() => Project_collaboratorsListRelationFilterObjectSchema).optional(),
  projects_projects_created_byTousers: z.lazy(() => ProjectsListRelationFilterObjectSchema).optional(),
  projects_projects_last_modified_byTousers: z.lazy(() => ProjectsListRelationFilterObjectSchema).optional(),
  relationships: z.lazy(() => RelationshipsListRelationFilterObjectSchema).optional(),
  tags: z.lazy(() => TagsListRelationFilterObjectSchema).optional()
}).strict();
export const usersWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => usersWhereInputObjectSchema), z.lazy(() => usersWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => usersWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => usersWhereInputObjectSchema), z.lazy(() => usersWhereInputObjectSchema).array()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  avatar_url: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  changelog: z.lazy(() => ChangelogListRelationFilterObjectSchema).optional(),
  evidence_items_evidence_items_created_byTousers: z.lazy(() => Evidence_itemsListRelationFilterObjectSchema).optional(),
  evidence_items_evidence_items_owner_idTousers: z.lazy(() => Evidence_itemsListRelationFilterObjectSchema).optional(),
  groups: z.lazy(() => GroupsListRelationFilterObjectSchema).optional(),
  metric_cards_metric_cards_created_byTousers: z.lazy(() => Metric_cardsListRelationFilterObjectSchema).optional(),
  metric_cards_metric_cards_owner_idTousers: z.lazy(() => Metric_cardsListRelationFilterObjectSchema).optional(),
  project_collaborators: z.lazy(() => Project_collaboratorsListRelationFilterObjectSchema).optional(),
  projects_projects_created_byTousers: z.lazy(() => ProjectsListRelationFilterObjectSchema).optional(),
  projects_projects_last_modified_byTousers: z.lazy(() => ProjectsListRelationFilterObjectSchema).optional(),
  relationships: z.lazy(() => RelationshipsListRelationFilterObjectSchema).optional(),
  tags: z.lazy(() => TagsListRelationFilterObjectSchema).optional()
}).strict();
