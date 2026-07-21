// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesCreateNestedManyWithoutCommentsInputObjectSchema } from './comment_likesCreateNestedManyWithoutCommentsInput.schema';
import { comment_mentionsCreateNestedManyWithoutCommentsInputObjectSchema } from './comment_mentionsCreateNestedManyWithoutCommentsInput.schema';
import { commentsCreateNestedManyWithoutCommentsInputObjectSchema } from './commentsCreateNestedManyWithoutCommentsInput.schema';
import { comment_threadsCreateNestedOneWithoutCommentsInputObjectSchema } from './comment_threadsCreateNestedOneWithoutCommentsInput.schema'

export const commentsCreateWithoutCommentsInputObjectSchema: z.ZodType<Prisma.commentsCreateWithoutCommentsInput, Prisma.commentsCreateWithoutCommentsInput> = z.object({
  id: z.string().optional(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  comment_likes: z.lazy(() => comment_likesCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsCreateNestedOneWithoutCommentsInputObjectSchema)
}).strict();
export const commentsCreateWithoutCommentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  comment_likes: z.lazy(() => comment_likesCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsCreateNestedManyWithoutCommentsInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsCreateNestedOneWithoutCommentsInputObjectSchema)
}).strict();
