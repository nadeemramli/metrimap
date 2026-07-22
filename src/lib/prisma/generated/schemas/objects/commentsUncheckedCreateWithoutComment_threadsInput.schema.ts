// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesUncheckedCreateNestedManyWithoutCommentsInputObjectSchema } from './comment_likesUncheckedCreateNestedManyWithoutCommentsInput.schema';
import { comment_mentionsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema } from './comment_mentionsUncheckedCreateNestedManyWithoutCommentsInput.schema';
import { commentsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema } from './commentsUncheckedCreateNestedManyWithoutCommentsInput.schema'

export const commentsUncheckedCreateWithoutComment_threadsInputObjectSchema: z.ZodType<Prisma.commentsUncheckedCreateWithoutComment_threadsInput, Prisma.commentsUncheckedCreateWithoutComment_threadsInput> = z.object({
  id: z.string().optional(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  parent_id: z.string().optional().nullable(),
  comment_likes: z.lazy(() => comment_likesUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional()
}).strict();
export const commentsUncheckedCreateWithoutComment_threadsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  parent_id: z.string().optional().nullable(),
  comment_likes: z.lazy(() => comment_likesUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional()
}).strict();
