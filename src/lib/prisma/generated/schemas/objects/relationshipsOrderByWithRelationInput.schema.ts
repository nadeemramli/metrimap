// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { evidence_itemsOrderByRelationAggregateInputObjectSchema } from './evidence_itemsOrderByRelationAggregateInput.schema';
import { relationship_historyOrderByRelationAggregateInputObjectSchema } from './relationship_historyOrderByRelationAggregateInput.schema';
import { relationship_tagsOrderByRelationAggregateInputObjectSchema } from './relationship_tagsOrderByRelationAggregateInput.schema';
import { usersOrderByWithRelationInputObjectSchema } from './usersOrderByWithRelationInput.schema';
import { projectsOrderByWithRelationInputObjectSchema } from './projectsOrderByWithRelationInput.schema';
import { metric_cardsOrderByWithRelationInputObjectSchema } from './metric_cardsOrderByWithRelationInput.schema'

export const relationshipsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.relationshipsOrderByWithRelationInput, Prisma.relationshipsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  target_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  confidence: SortOrderSchema.optional(),
  weight: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  causal_metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_handle: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  target_handle: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  evidence_items: z.lazy(() => evidence_itemsOrderByRelationAggregateInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyOrderByRelationAggregateInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsOrderByRelationAggregateInputObjectSchema).optional(),
  users: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  metric_cards_relationships_source_idTometric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional(),
  metric_cards_relationships_target_idTometric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const relationshipsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  target_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  confidence: SortOrderSchema.optional(),
  weight: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  causal_metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_handle: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  target_handle: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  evidence_items: z.lazy(() => evidence_itemsOrderByRelationAggregateInputObjectSchema).optional(),
  relationship_history: z.lazy(() => relationship_historyOrderByRelationAggregateInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsOrderByRelationAggregateInputObjectSchema).optional(),
  users: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional(),
  metric_cards_relationships_source_idTometric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional(),
  metric_cards_relationships_target_idTometric_cards: z.lazy(() => metric_cardsOrderByWithRelationInputObjectSchema).optional()
}).strict();
