// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsSelectObjectSchema } from './commentsSelect.schema';
import { commentsIncludeObjectSchema } from './commentsInclude.schema'

export const commentsArgsObjectSchema = z.object({
  select: z.lazy(() => commentsSelectObjectSchema).optional(),
  include: z.lazy(() => commentsIncludeObjectSchema).optional()
}).strict();
export const commentsArgsObjectZodSchema = z.object({
  select: z.lazy(() => commentsSelectObjectSchema).optional(),
  include: z.lazy(() => commentsIncludeObjectSchema).optional()
}).strict();
