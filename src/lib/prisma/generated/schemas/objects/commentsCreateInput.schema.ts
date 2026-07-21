// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesCreateNestedManyWithoutCommentsInputObjectSchema } from './comment_likesCreateNestedManyWithoutCommentsInput.schema';
import { comment_mentionsCreateNestedManyWithoutCommentsInputObjectSchema } from './comment_mentionsCreateNestedManyWithoutCommentsInput.schema';
import { commentsCreateNestedOneWithoutOther_commentsInputObjectSchema } from './commentsCreateNestedOneWithoutOther_commentsInput.schema';
import { commentsCreateNestedManyWithoutCommentsInputObjectSchema } from './commentsCreateNestedManyWithoutCommentsInput.schema';
import { comment_threadsCreateNestedOneWithoutCommentsInputObjectSchema } from './comment_threadsCreateNestedOneWithoutCommentsInput.schema'

export const commentsCreateInputObjectSchema: z.ZodType<Prisma.commentsCreateInput, Prisma.commentsCreateInput> = z.object({
  id: z.string().optional(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  comment_likes: z.lazy(() => comment_likesCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comments: z.lazy(() => commentsCreateNestedOneWithoutOther_commentsInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsCreateNestedOneWithoutCommentsInputObjectSchema)
}).strict();
export const commentsCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  comment_likes: z.lazy(() => comment_likesCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comments: z.lazy(() => commentsCreateNestedOneWithoutOther_commentsInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsCreateNestedOneWithoutCommentsInputObjectSchema)
}).strict();
