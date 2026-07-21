// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { workspace_groupsOrderByWithRelationInputObjectSchema } from './workspace_groupsOrderByWithRelationInput.schema'

export const group_membersOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.group_membersOrderByWithRelationInput, Prisma.group_membersOrderByWithRelationInput> = z.object({
  group_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  added_by: SortOrderSchema.optional(),
  added_at: SortOrderSchema.optional(),
  workspace_groups: z.lazy(() => workspace_groupsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const group_membersOrderByWithRelationInputObjectZodSchema = z.object({
  group_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  added_by: SortOrderSchema.optional(),
  added_at: SortOrderSchema.optional(),
  workspace_groups: z.lazy(() => workspace_groupsOrderByWithRelationInputObjectSchema).optional()
}).strict();
