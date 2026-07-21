// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsArgsObjectSchema } from './commentsArgs.schema'

export const comment_likesIncludeObjectSchema: z.ZodType<Prisma.comment_likesInclude, Prisma.comment_likesInclude> = z.object({
  comments: z.union([z.boolean(), z.lazy(() => commentsArgsObjectSchema)]).optional()
}).strict();
export const comment_likesIncludeObjectZodSchema = z.object({
  comments: z.union([z.boolean(), z.lazy(() => commentsArgsObjectSchema)]).optional()
}).strict();
