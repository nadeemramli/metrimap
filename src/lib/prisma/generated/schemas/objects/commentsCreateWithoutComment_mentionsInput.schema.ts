// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesCreateNestedManyWithoutCommentsInputObjectSchema } from './comment_likesCreateNestedManyWithoutCommentsInput.schema';
import { commentsCreateNestedOneWithoutOther_commentsInputObjectSchema } from './commentsCreateNestedOneWithoutOther_commentsInput.schema';
import { commentsCreateNestedManyWithoutCommentsInputObjectSchema } from './commentsCreateNestedManyWithoutCommentsInput.schema';
import { comment_threadsCreateNestedOneWithoutCommentsInputObjectSchema } from './comment_threadsCreateNestedOneWithoutCommentsInput.schema'

export const commentsCreateWithoutComment_mentionsInputObjectSchema: z.ZodType<Prisma.commentsCreateWithoutComment_mentionsInput, Prisma.commentsCreateWithoutComment_mentionsInput> = z.object({
  id: z.string().optional(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  comment_likes: z.lazy(() => comment_likesCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comments: z.lazy(() => commentsCreateNestedOneWithoutOther_commentsInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsCreateNestedOneWithoutCommentsInputObjectSchema)
}).strict();
export const commentsCreateWithoutComment_mentionsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  comment_likes: z.lazy(() => comment_likesCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comments: z.lazy(() => commentsCreateNestedOneWithoutOther_commentsInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsCreateNestedOneWithoutCommentsInputObjectSchema)
}).strict();
