// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Comment_likesFindManySchema } from '../findManycomment_likes.schema';
import { Comment_mentionsFindManySchema } from '../findManycomment_mentions.schema';
import { commentsArgsObjectSchema } from './commentsArgs.schema';
import { CommentsFindManySchema } from '../findManycomments.schema';
import { comment_threadsArgsObjectSchema } from './comment_threadsArgs.schema';
import { commentsCountOutputTypeArgsObjectSchema } from './commentsCountOutputTypeArgs.schema'

export const commentsIncludeObjectSchema: z.ZodType<Prisma.commentsInclude, Prisma.commentsInclude> = z.object({
  comment_likes: z.union([z.boolean(), z.lazy(() => Comment_likesFindManySchema)]).optional(),
  comment_mentions: z.union([z.boolean(), z.lazy(() => Comment_mentionsFindManySchema)]).optional(),
  comments: z.union([z.boolean(), z.lazy(() => commentsArgsObjectSchema)]).optional(),
  other_comments: z.union([z.boolean(), z.lazy(() => CommentsFindManySchema)]).optional(),
  comment_threads: z.union([z.boolean(), z.lazy(() => comment_threadsArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => commentsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const commentsIncludeObjectZodSchema = z.object({
  comment_likes: z.union([z.boolean(), z.lazy(() => Comment_likesFindManySchema)]).optional(),
  comment_mentions: z.union([z.boolean(), z.lazy(() => Comment_mentionsFindManySchema)]).optional(),
  comments: z.union([z.boolean(), z.lazy(() => commentsArgsObjectSchema)]).optional(),
  other_comments: z.union([z.boolean(), z.lazy(() => CommentsFindManySchema)]).optional(),
  comment_threads: z.union([z.boolean(), z.lazy(() => comment_threadsArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => commentsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
