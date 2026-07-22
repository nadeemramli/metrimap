// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ChangelogFindManySchema } from '../findManychangelog.schema';
import { Evidence_itemsFindManySchema } from '../findManyevidence_items.schema';
import { GroupsFindManySchema } from '../findManygroups.schema';
import { Metric_cardsFindManySchema } from '../findManymetric_cards.schema';
import { Project_collaboratorsFindManySchema } from '../findManyproject_collaborators.schema';
import { ProjectsFindManySchema } from '../findManyprojects.schema';
import { RelationshipsFindManySchema } from '../findManyrelationships.schema';
import { TagsFindManySchema } from '../findManytags.schema';
import { usersCountOutputTypeArgsObjectSchema } from './usersCountOutputTypeArgs.schema'

export const usersIncludeObjectSchema: z.ZodType<Prisma.usersInclude, Prisma.usersInclude> = z.object({
  changelog: z.union([z.boolean(), z.lazy(() => ChangelogFindManySchema)]).optional(),
  evidence_items_evidence_items_created_byTousers: z.union([z.boolean(), z.lazy(() => Evidence_itemsFindManySchema)]).optional(),
  evidence_items_evidence_items_owner_idTousers: z.union([z.boolean(), z.lazy(() => Evidence_itemsFindManySchema)]).optional(),
  groups: z.union([z.boolean(), z.lazy(() => GroupsFindManySchema)]).optional(),
  metric_cards_metric_cards_created_byTousers: z.union([z.boolean(), z.lazy(() => Metric_cardsFindManySchema)]).optional(),
  metric_cards_metric_cards_owner_idTousers: z.union([z.boolean(), z.lazy(() => Metric_cardsFindManySchema)]).optional(),
  project_collaborators: z.union([z.boolean(), z.lazy(() => Project_collaboratorsFindManySchema)]).optional(),
  projects_projects_created_byTousers: z.union([z.boolean(), z.lazy(() => ProjectsFindManySchema)]).optional(),
  projects_projects_last_modified_byTousers: z.union([z.boolean(), z.lazy(() => ProjectsFindManySchema)]).optional(),
  relationships: z.union([z.boolean(), z.lazy(() => RelationshipsFindManySchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => TagsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => usersCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const usersIncludeObjectZodSchema = z.object({
  changelog: z.union([z.boolean(), z.lazy(() => ChangelogFindManySchema)]).optional(),
  evidence_items_evidence_items_created_byTousers: z.union([z.boolean(), z.lazy(() => Evidence_itemsFindManySchema)]).optional(),
  evidence_items_evidence_items_owner_idTousers: z.union([z.boolean(), z.lazy(() => Evidence_itemsFindManySchema)]).optional(),
  groups: z.union([z.boolean(), z.lazy(() => GroupsFindManySchema)]).optional(),
  metric_cards_metric_cards_created_byTousers: z.union([z.boolean(), z.lazy(() => Metric_cardsFindManySchema)]).optional(),
  metric_cards_metric_cards_owner_idTousers: z.union([z.boolean(), z.lazy(() => Metric_cardsFindManySchema)]).optional(),
  project_collaborators: z.union([z.boolean(), z.lazy(() => Project_collaboratorsFindManySchema)]).optional(),
  projects_projects_created_byTousers: z.union([z.boolean(), z.lazy(() => ProjectsFindManySchema)]).optional(),
  projects_projects_last_modified_byTousers: z.union([z.boolean(), z.lazy(() => ProjectsFindManySchema)]).optional(),
  relationships: z.union([z.boolean(), z.lazy(() => RelationshipsFindManySchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => TagsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => usersCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
