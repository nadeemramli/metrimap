// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { workspace_groupsOrderByWithRelationInputObjectSchema } from './workspace_groupsOrderByWithRelationInput.schema';
import { tagsOrderByWithRelationInputObjectSchema } from './tagsOrderByWithRelationInput.schema'

export const tag_audiencesOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.tag_audiencesOrderByWithRelationInput, Prisma.tag_audiencesOrderByWithRelationInput> = z.object({
  tag_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional(),
  workspace_groups: z.lazy(() => workspace_groupsOrderByWithRelationInputObjectSchema).optional(),
  tags: z.lazy(() => tagsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const tag_audiencesOrderByWithRelationInputObjectZodSchema = z.object({
  tag_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional(),
  workspace_groups: z.lazy(() => workspace_groupsOrderByWithRelationInputObjectSchema).optional(),
  tags: z.lazy(() => tagsOrderByWithRelationInputObjectSchema).optional()
}).strict();
