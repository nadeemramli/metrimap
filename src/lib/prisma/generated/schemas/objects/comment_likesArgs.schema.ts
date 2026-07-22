// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesSelectObjectSchema } from './comment_likesSelect.schema';
import { comment_likesIncludeObjectSchema } from './comment_likesInclude.schema'

export const comment_likesArgsObjectSchema = z.object({
  select: z.lazy(() => comment_likesSelectObjectSchema).optional(),
  include: z.lazy(() => comment_likesIncludeObjectSchema).optional()
}).strict();
export const comment_likesArgsObjectZodSchema = z.object({
  select: z.lazy(() => comment_likesSelectObjectSchema).optional(),
  include: z.lazy(() => comment_likesIncludeObjectSchema).optional()
}).strict();
