// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { metric_cardsOrderByWithRelationInputObjectSchema } from './metric_cardsOrderByWithRelationInput.schema';
import { usersOrderByWithRelationInputObjectSchema } from './usersOrderByWithRelationInput.schema';
import { projectsOrderByWithRelationInputObjectSchema } from './projectsOrderByWithRelationInput.schema';
import { relationshipsOrderByWithRelationInputObjectSchema } from './relationshipsOrderByWithRelationInput.schema'

export const evidence_itemsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.evidence_itemsOrderByWithRelationInput, Prisma.evidence_itemsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  owner_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  link: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  hypothesis: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  summary: SortOrderSchema.optional(),
  impact_on_confidence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  content: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  is_public: SortOrderSchema.optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional(),
  users_evidence_items_created_byTousers: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  users_evidence_items_owner_idTousers: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const evidence_itemsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  owner_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  link: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  hypothesis: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  summary: SortOrderSchema.optional(),
  impact_on_confidence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  content: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  is_public: SortOrderSchema.optional(),
  metric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional(),
  users_evidence_items_created_byTousers: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  users_evidence_items_owner_idTousers: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  relationships: z.lazy(() => relationshipsOrderByWithRelationInputObjectSchema).optional()
}).strict();
