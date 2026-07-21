// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsArgsObjectSchema } from './workspace_groupsArgs.schema'

export const group_membersSelectObjectSchema: z.ZodType<Prisma.group_membersSelect, Prisma.group_membersSelect> = z.object({
  group_id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  added_by: z.boolean().optional(),
  added_at: z.boolean().optional(),
  workspace_groups: z.union([z.boolean(), z.lazy(() => workspace_groupsArgsObjectSchema)]).optional()
}).strict();
export const group_membersSelectObjectZodSchema = z.object({
  group_id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  added_by: z.boolean().optional(),
  added_at: z.boolean().optional(),
  workspace_groups: z.union([z.boolean(), z.lazy(() => workspace_groupsArgsObjectSchema)]).optional()
}).strict();
