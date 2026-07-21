// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsArgsObjectSchema } from './workspace_groupsArgs.schema'

export const group_membersIncludeObjectSchema: z.ZodType<Prisma.group_membersInclude, Prisma.group_membersInclude> = z.object({
  workspace_groups: z.union([z.boolean(), z.lazy(() => workspace_groupsArgsObjectSchema)]).optional()
}).strict();
export const group_membersIncludeObjectZodSchema = z.object({
  workspace_groups: z.union([z.boolean(), z.lazy(() => workspace_groupsArgsObjectSchema)]).optional()
}).strict();
