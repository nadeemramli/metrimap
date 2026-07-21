// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesUncheckedCreateNestedManyWithoutCommentsInputObjectSchema } from './comment_likesUncheckedCreateNestedManyWithoutCommentsInput.schema';
import { commentsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema } from './commentsUncheckedCreateNestedManyWithoutCommentsInput.schema'

export const commentsUncheckedCreateWithoutComment_mentionsInputObjectSchema: z.ZodType<Prisma.commentsUncheckedCreateWithoutComment_mentionsInput, Prisma.commentsUncheckedCreateWithoutComment_mentionsInput> = z.object({
  id: z.string().optional(),
  thread_id: z.string(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  parent_id: z.string().optional().nullable(),
  comment_likes: z.lazy(() => comment_likesUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional()
}).strict();
export const commentsUncheckedCreateWithoutComment_mentionsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  thread_id: z.string(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  parent_id: z.string().optional().nullable(),
  comment_likes: z.lazy(() => comment_likesUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional()
}).strict();
