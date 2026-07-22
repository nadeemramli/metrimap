// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesUncheckedCreateNestedManyWithoutCommentsInputObjectSchema } from './comment_likesUncheckedCreateNestedManyWithoutCommentsInput.schema';
import { comment_mentionsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema } from './comment_mentionsUncheckedCreateNestedManyWithoutCommentsInput.schema'

export const commentsUncheckedCreateWithoutOther_commentsInputObjectSchema: z.ZodType<Prisma.commentsUncheckedCreateWithoutOther_commentsInput, Prisma.commentsUncheckedCreateWithoutOther_commentsInput> = z.object({
  id: z.string().optional(),
  thread_id: z.string(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  parent_id: z.string().optional().nullable(),
  comment_likes: z.lazy(() => comment_likesUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional()
}).strict();
export const commentsUncheckedCreateWithoutOther_commentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  thread_id: z.string(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  parent_id: z.string().optional().nullable(),
  comment_likes: z.lazy(() => comment_likesUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsUncheckedCreateNestedManyWithoutCommentsInputObjectSchema).optional()
}).strict();
