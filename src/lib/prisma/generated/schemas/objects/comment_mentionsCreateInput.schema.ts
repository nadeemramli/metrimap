// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateNestedOneWithoutComment_mentionsInputObjectSchema } from './commentsCreateNestedOneWithoutComment_mentionsInput.schema'

export const comment_mentionsCreateInputObjectSchema: z.ZodType<Prisma.comment_mentionsCreateInput, Prisma.comment_mentionsCreateInput> = z.object({
  id: z.string().optional(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  comments: z.lazy(() => commentsCreateNestedOneWithoutComment_mentionsInputObjectSchema)
}).strict();
export const comment_mentionsCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  comments: z.lazy(() => commentsCreateNestedOneWithoutComment_mentionsInputObjectSchema)
}).strict();
