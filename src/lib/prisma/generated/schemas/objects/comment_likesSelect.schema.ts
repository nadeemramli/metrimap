// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsArgsObjectSchema } from './commentsArgs.schema'

export const comment_likesSelectObjectSchema: z.ZodType<Prisma.comment_likesSelect, Prisma.comment_likesSelect> = z.object({
  comment_id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  comments: z.union([z.boolean(), z.lazy(() => commentsArgsObjectSchema)]).optional()
}).strict();
export const comment_likesSelectObjectZodSchema = z.object({
  comment_id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  comments: z.union([z.boolean(), z.lazy(() => commentsArgsObjectSchema)]).optional()
}).strict();
