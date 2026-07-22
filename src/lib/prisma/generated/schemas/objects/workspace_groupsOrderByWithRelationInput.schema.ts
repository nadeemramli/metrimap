// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { group_membersOrderByRelationAggregateInputObjectSchema } from './group_membersOrderByRelationAggregateInput.schema';
import { node_access_grantsOrderByRelationAggregateInputObjectSchema } from './node_access_grantsOrderByRelationAggregateInput.schema';
import { tag_audiencesOrderByRelationAggregateInputObjectSchema } from './tag_audiencesOrderByRelationAggregateInput.schema'

export const workspace_groupsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.workspace_groupsOrderByWithRelationInput, Prisma.workspace_groupsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  group_members: z.lazy(() => group_membersOrderByRelationAggregateInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsOrderByRelationAggregateInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const workspace_groupsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  group_members: z.lazy(() => group_membersOrderByRelationAggregateInputObjectSchema).optional(),
  node_access_grants: z.lazy(() => node_access_grantsOrderByRelationAggregateInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
