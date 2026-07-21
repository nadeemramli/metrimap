// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { CommentsFindManySchema } from '../findManycomments.schema';
import { comment_threadsCountOutputTypeArgsObjectSchema } from './comment_threadsCountOutputTypeArgs.schema'

export const comment_threadsIncludeObjectSchema: z.ZodType<Prisma.comment_threadsInclude, Prisma.comment_threadsInclude> = z.object({
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  comments: z.union([z.boolean(), z.lazy(() => CommentsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => comment_threadsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const comment_threadsIncludeObjectZodSchema = z.object({
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  comments: z.union([z.boolean(), z.lazy(() => CommentsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => comment_threadsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
