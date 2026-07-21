// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersSelectObjectSchema } from './usersSelect.schema';
import { usersIncludeObjectSchema } from './usersInclude.schema'

export const usersArgsObjectSchema = z.object({
  select: z.lazy(() => usersSelectObjectSchema).optional(),
  include: z.lazy(() => usersIncludeObjectSchema).optional()
}).strict();
export const usersArgsObjectZodSchema = z.object({
  select: z.lazy(() => usersSelectObjectSchema).optional(),
  include: z.lazy(() => usersIncludeObjectSchema).optional()
}).strict();
