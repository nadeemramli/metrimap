// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_likesCreateWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_likesCreateWithoutCommentsInput, Prisma.comment_likesCreateWithoutCommentsInput> = z.object({
  user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const comment_likesCreateWithoutCommentsInputObjectZodSchema = z.object({
  user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
