import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersSelectObjectSchema } from './usersSelect.schema'

export const usersArgsObjectSchema = z.object({
  select: z.lazy(() => usersSelectObjectSchema).optional()
}).strict();
export const usersArgsObjectZodSchema = z.object({
  select: z.lazy(() => usersSelectObjectSchema).optional()
}).strict();
