// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateNestedOneWithoutComment_likesInputObjectSchema } from './commentsCreateNestedOneWithoutComment_likesInput.schema'

export const comment_likesCreateInputObjectSchema: z.ZodType<Prisma.comment_likesCreateInput, Prisma.comment_likesCreateInput> = z.object({
  user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  comments: z.lazy(() => commentsCreateNestedOneWithoutComment_likesInputObjectSchema)
}).strict();
export const comment_likesCreateInputObjectZodSchema = z.object({
  user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  comments: z.lazy(() => commentsCreateNestedOneWithoutComment_likesInputObjectSchema)
}).strict();
