// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_mentionsSelectObjectSchema } from './comment_mentionsSelect.schema';
import { comment_mentionsIncludeObjectSchema } from './comment_mentionsInclude.schema'

export const comment_mentionsArgsObjectSchema = z.object({
  select: z.lazy(() => comment_mentionsSelectObjectSchema).optional(),
  include: z.lazy(() => comment_mentionsIncludeObjectSchema).optional()
}).strict();
export const comment_mentionsArgsObjectZodSchema = z.object({
  select: z.lazy(() => comment_mentionsSelectObjectSchema).optional(),
  include: z.lazy(() => comment_mentionsIncludeObjectSchema).optional()
}).strict();
