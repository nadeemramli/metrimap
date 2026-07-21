// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsSelectObjectSchema } from './comment_threadsSelect.schema';
import { comment_threadsIncludeObjectSchema } from './comment_threadsInclude.schema'

export const comment_threadsArgsObjectSchema = z.object({
  select: z.lazy(() => comment_threadsSelectObjectSchema).optional(),
  include: z.lazy(() => comment_threadsIncludeObjectSchema).optional()
}).strict();
export const comment_threadsArgsObjectZodSchema = z.object({
  select: z.lazy(() => comment_threadsSelectObjectSchema).optional(),
  include: z.lazy(() => comment_threadsIncludeObjectSchema).optional()
}).strict();
