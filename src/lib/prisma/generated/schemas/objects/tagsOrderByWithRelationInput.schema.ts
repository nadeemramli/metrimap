// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { metric_card_tagsOrderByRelationAggregateInputObjectSchema } from './metric_card_tagsOrderByRelationAggregateInput.schema';
import { relationship_tagsOrderByRelationAggregateInputObjectSchema } from './relationship_tagsOrderByRelationAggregateInput.schema';
import { tag_audiencesOrderByRelationAggregateInputObjectSchema } from './tag_audiencesOrderByRelationAggregateInput.schema';
import { usersOrderByWithRelationInputObjectSchema } from './usersOrderByWithRelationInput.schema';
import { projectsOrderByWithRelationInputObjectSchema } from './projectsOrderByWithRelationInput.schema'

export const tagsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.tagsOrderByWithRelationInput, Prisma.tagsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  is_access: SortOrderSchema.optional(),
  redaction_mode: SortOrderSchema.optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsOrderByRelationAggregateInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsOrderByRelationAggregateInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesOrderByRelationAggregateInputObjectSchema).optional(),
  users: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const tagsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  is_access: SortOrderSchema.optional(),
  redaction_mode: SortOrderSchema.optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsOrderByRelationAggregateInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsOrderByRelationAggregateInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesOrderByRelationAggregateInputObjectSchema).optional(),
  users: z.lazy(() => usersOrderByWithRelationInputObjectSchema).optional(),
  projects: z.lazy(() => projectsOrderByWithRelationInputObjectSchema).optional()
}).strict();
