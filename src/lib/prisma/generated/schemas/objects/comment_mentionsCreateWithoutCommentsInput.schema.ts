// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_mentionsCreateWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_mentionsCreateWithoutCommentsInput, Prisma.comment_mentionsCreateWithoutCommentsInput> = z.object({
  id: z.string().optional(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const comment_mentionsCreateWithoutCommentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
