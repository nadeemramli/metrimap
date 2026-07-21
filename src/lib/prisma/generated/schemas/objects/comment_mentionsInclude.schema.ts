// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsArgsObjectSchema } from './commentsArgs.schema'

export const comment_mentionsIncludeObjectSchema: z.ZodType<Prisma.comment_mentionsInclude, Prisma.comment_mentionsInclude> = z.object({
  comments: z.union([z.boolean(), z.lazy(() => commentsArgsObjectSchema)]).optional()
}).strict();
export const comment_mentionsIncludeObjectZodSchema = z.object({
  comments: z.union([z.boolean(), z.lazy(() => commentsArgsObjectSchema)]).optional()
}).strict();
