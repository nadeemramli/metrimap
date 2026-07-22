// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_likesUncheckedCreateWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_likesUncheckedCreateWithoutCommentsInput, Prisma.comment_likesUncheckedCreateWithoutCommentsInput> = z.object({
  user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const comment_likesUncheckedCreateWithoutCommentsInputObjectZodSchema = z.object({
  user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
