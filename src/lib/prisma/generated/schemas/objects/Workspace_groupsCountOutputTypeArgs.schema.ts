// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Workspace_groupsCountOutputTypeSelectObjectSchema } from './Workspace_groupsCountOutputTypeSelect.schema'

export const Workspace_groupsCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => Workspace_groupsCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const Workspace_groupsCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => Workspace_groupsCountOutputTypeSelectObjectSchema).optional()
}).strict();
