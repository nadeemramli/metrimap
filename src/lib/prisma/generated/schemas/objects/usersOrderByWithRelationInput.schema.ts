// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { changelogOrderByRelationAggregateInputObjectSchema } from './changelogOrderByRelationAggregateInput.schema';
import { evidence_itemsOrderByRelationAggregateInputObjectSchema } from './evidence_itemsOrderByRelationAggregateInput.schema';
import { groupsOrderByRelationAggregateInputObjectSchema } from './groupsOrderByRelationAggregateInput.schema';
import { metric_cardsOrderByRelationAggregateInputObjectSchema } from './metric_cardsOrderByRelationAggregateInput.schema';
import { project_collaboratorsOrderByRelationAggregateInputObjectSchema } from './project_collaboratorsOrderByRelationAggregateInput.schema';
import { projectsOrderByRelationAggregateInputObjectSchema } from './projectsOrderByRelationAggregateInput.schema';
import { relationshipsOrderByRelationAggregateInputObjectSchema } from './relationshipsOrderByRelationAggregateInput.schema';
import { tagsOrderByRelationAggregateInputObjectSchema } from './tagsOrderByRelationAggregateInput.schema'

export const usersOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.usersOrderByWithRelationInput, Prisma.usersOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  avatar_url: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  changelog: z.lazy(() => changelogOrderByRelationAggregateInputObjectSchema).optional(),
  evidence_items_evidence_items_created_byTousers: z.lazy(() => evidence_itemsOrderByRelationAggregateInputObjectSchema).optional(),
  evidence_items_evidence_items_owner_idTousers: z.lazy(() => evidence_itemsOrderByRelationAggregateInputObjectSchema).optional(),
  groups: z.lazy(() => groupsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_cards_metric_cards_created_byTousers: z.lazy(() => metric_cardsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_cards_metric_cards_owner_idTousers: z.lazy(() => metric_cardsOrderByRelationAggregateInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsOrderByRelationAggregateInputObjectSchema).optional(),
  projects_projects_created_byTousers: z.lazy(() => projectsOrderByRelationAggregateInputObjectSchema).optional(),
  projects_projects_last_modified_byTousers: z.lazy(() => projectsOrderByRelationAggregateInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsOrderByRelationAggregateInputObjectSchema).optional(),
  tags: z.lazy(() => tagsOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const usersOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  avatar_url: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  changelog: z.lazy(() => changelogOrderByRelationAggregateInputObjectSchema).optional(),
  evidence_items_evidence_items_created_byTousers: z.lazy(() => evidence_itemsOrderByRelationAggregateInputObjectSchema).optional(),
  evidence_items_evidence_items_owner_idTousers: z.lazy(() => evidence_itemsOrderByRelationAggregateInputObjectSchema).optional(),
  groups: z.lazy(() => groupsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_cards_metric_cards_created_byTousers: z.lazy(() => metric_cardsOrderByRelationAggregateInputObjectSchema).optional(),
  metric_cards_metric_cards_owner_idTousers: z.lazy(() => metric_cardsOrderByRelationAggregateInputObjectSchema).optional(),
  project_collaborators: z.lazy(() => project_collaboratorsOrderByRelationAggregateInputObjectSchema).optional(),
  projects_projects_created_byTousers: z.lazy(() => projectsOrderByRelationAggregateInputObjectSchema).optional(),
  projects_projects_last_modified_byTousers: z.lazy(() => projectsOrderByRelationAggregateInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsOrderByRelationAggregateInputObjectSchema).optional(),
  tags: z.lazy(() => tagsOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
