// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsSelectObjectSchema } from './workspace_groupsSelect.schema';
import { workspace_groupsIncludeObjectSchema } from './workspace_groupsInclude.schema'

export const workspace_groupsArgsObjectSchema = z.object({
  select: z.lazy(() => workspace_groupsSelectObjectSchema).optional(),
  include: z.lazy(() => workspace_groupsIncludeObjectSchema).optional()
}).strict();
export const workspace_groupsArgsObjectZodSchema = z.object({
  select: z.lazy(() => workspace_groupsSelectObjectSchema).optional(),
  include: z.lazy(() => workspace_groupsIncludeObjectSchema).optional()
}).strict();
