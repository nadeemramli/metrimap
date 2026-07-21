// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogSelectObjectSchema } from './changelogSelect.schema';
import { changelogIncludeObjectSchema } from './changelogInclude.schema'

export const changelogArgsObjectSchema = z.object({
  select: z.lazy(() => changelogSelectObjectSchema).optional(),
  include: z.lazy(() => changelogIncludeObjectSchema).optional()
}).strict();
export const changelogArgsObjectZodSchema = z.object({
  select: z.lazy(() => changelogSelectObjectSchema).optional(),
  include: z.lazy(() => changelogIncludeObjectSchema).optional()
}).strict();
