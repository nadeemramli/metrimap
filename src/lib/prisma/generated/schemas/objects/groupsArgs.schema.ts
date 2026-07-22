// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsSelectObjectSchema } from './groupsSelect.schema';
import { groupsIncludeObjectSchema } from './groupsInclude.schema'

export const groupsArgsObjectSchema = z.object({
  select: z.lazy(() => groupsSelectObjectSchema).optional(),
  include: z.lazy(() => groupsIncludeObjectSchema).optional()
}).strict();
export const groupsArgsObjectZodSchema = z.object({
  select: z.lazy(() => groupsSelectObjectSchema).optional(),
  include: z.lazy(() => groupsIncludeObjectSchema).optional()
}).strict();
