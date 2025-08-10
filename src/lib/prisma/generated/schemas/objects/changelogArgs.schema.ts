import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogSelectObjectSchema } from './changelogSelect.schema'

export const changelogArgsObjectSchema = z.object({
  select: z.lazy(() => changelogSelectObjectSchema).optional()
}).strict();
export const changelogArgsObjectZodSchema = z.object({
  select: z.lazy(() => changelogSelectObjectSchema).optional()
}).strict();
