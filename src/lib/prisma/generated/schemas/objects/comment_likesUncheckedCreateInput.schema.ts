// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_likesUncheckedCreateInputObjectSchema: z.ZodType<Prisma.comment_likesUncheckedCreateInput, Prisma.comment_likesUncheckedCreateInput> = z.object({
  comment_id: z.string(),
  user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const comment_likesUncheckedCreateInputObjectZodSchema = z.object({
  comment_id: z.string(),
  user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
