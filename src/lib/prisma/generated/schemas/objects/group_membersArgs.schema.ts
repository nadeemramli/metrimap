// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { group_membersSelectObjectSchema } from './group_membersSelect.schema';
import { group_membersIncludeObjectSchema } from './group_membersInclude.schema'

export const group_membersArgsObjectSchema = z.object({
  select: z.lazy(() => group_membersSelectObjectSchema).optional(),
  include: z.lazy(() => group_membersIncludeObjectSchema).optional()
}).strict();
export const group_membersArgsObjectZodSchema = z.object({
  select: z.lazy(() => group_membersSelectObjectSchema).optional(),
  include: z.lazy(() => group_membersIncludeObjectSchema).optional()
}).strict();
