// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_likesCreateManyCommentsInputObjectSchema: z.ZodType<Prisma.comment_likesCreateManyCommentsInput, Prisma.comment_likesCreateManyCommentsInput> = z.object({
  user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const comment_likesCreateManyCommentsInputObjectZodSchema = z.object({
  user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
