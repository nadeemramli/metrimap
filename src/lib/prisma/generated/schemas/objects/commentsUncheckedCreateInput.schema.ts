// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesUncheckedCreateNestedManyWithoutCommentsInputObjectSchema } from './comment_likesUncheckedCreateNestedManyWithoutCommentsInput.schema';
import { comment_mentionsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema } from './comment_mentionsUncheckedCreateNestedManyWithoutCommentsInput.schema';
import { commentsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema } from './commentsUncheckedCreateNestedManyWithoutCommentsInput.schema'

export const commentsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.commentsUncheckedCreateInput, Prisma.commentsUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  thread_id: z.string(),
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
export const commentsUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  thread_id: z.string(),
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
