// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_mentionsUncheckedCreateWithoutCommentsInput, Prisma.comment_mentionsUncheckedCreateWithoutCommentsInput> = z.object({
  id: z.string().optional(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const comment_mentionsUncheckedCreateWithoutCommentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
