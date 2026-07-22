// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsCreateNestedOneWithoutGroup_membersInputObjectSchema } from './workspace_groupsCreateNestedOneWithoutGroup_membersInput.schema'

export const group_membersCreateInputObjectSchema: z.ZodType<Prisma.group_membersCreateInput, Prisma.group_membersCreateInput> = z.object({
  user_id: z.string(),
  added_by: z.string().optional(),
  added_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_groups: z.lazy(() => workspace_groupsCreateNestedOneWithoutGroup_membersInputObjectSchema)
}).strict();
export const group_membersCreateInputObjectZodSchema = z.object({
  user_id: z.string(),
  added_by: z.string().optional(),
  added_at: z.union([z.date(), z.string().datetime()]).optional(),
  workspace_groups: z.lazy(() => workspace_groupsCreateNestedOneWithoutGroup_membersInputObjectSchema)
}).strict();
