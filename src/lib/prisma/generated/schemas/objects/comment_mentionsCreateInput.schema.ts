import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_mentionsCreateInputObjectSchema: z.ZodType<Prisma.comment_mentionsCreateInput, Prisma.comment_mentionsCreateInput> = z.object({
  comment_id: z.string(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const comment_mentionsCreateInputObjectZodSchema = z.object({
  comment_id: z.string(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
