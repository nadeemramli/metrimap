// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsArgsObjectSchema } from './commentsArgs.schema'

export const comment_mentionsSelectObjectSchema: z.ZodType<Prisma.comment_mentionsSelect, Prisma.comment_mentionsSelect> = z.object({
  id: z.boolean().optional(),
  comment_id: z.boolean().optional(),
  mentioned_user_id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  comments: z.union([z.boolean(), z.lazy(() => commentsArgsObjectSchema)]).optional()
}).strict();
export const comment_mentionsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  comment_id: z.boolean().optional(),
  mentioned_user_id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  comments: z.union([z.boolean(), z.lazy(() => commentsArgsObjectSchema)]).optional()
}).strict();
