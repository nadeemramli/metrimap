import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsSelectObjectSchema } from './groupsSelect.schema'

export const groupsArgsObjectSchema = z.object({
  select: z.lazy(() => groupsSelectObjectSchema).optional()
}).strict();
export const groupsArgsObjectZodSchema = z.object({
  select: z.lazy(() => groupsSelectObjectSchema).optional()
}).strict();
