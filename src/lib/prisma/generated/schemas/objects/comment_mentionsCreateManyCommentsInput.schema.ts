// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_mentionsCreateManyCommentsInputObjectSchema: z.ZodType<Prisma.comment_mentionsCreateManyCommentsInput, Prisma.comment_mentionsCreateManyCommentsInput> = z.object({
  id: z.string().optional(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const comment_mentionsCreateManyCommentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
