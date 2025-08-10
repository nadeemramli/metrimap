import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_mentionsSelectObjectSchema } from './comment_mentionsSelect.schema'

export const comment_mentionsArgsObjectSchema = z.object({
  select: z.lazy(() => comment_mentionsSelectObjectSchema).optional()
}).strict();
export const comment_mentionsArgsObjectZodSchema = z.object({
  select: z.lazy(() => comment_mentionsSelectObjectSchema).optional()
}).strict();
