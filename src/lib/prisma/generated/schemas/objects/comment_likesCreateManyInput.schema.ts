// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_likesCreateManyInputObjectSchema: z.ZodType<Prisma.comment_likesCreateManyInput, Prisma.comment_likesCreateManyInput> = z.object({
  comment_id: z.string(),
  user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const comment_likesCreateManyInputObjectZodSchema = z.object({
  comment_id: z.string(),
  user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
