import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_mentionsCreateManyInputObjectSchema: z.ZodType<Prisma.comment_mentionsCreateManyInput, Prisma.comment_mentionsCreateManyInput> = z.object({
  comment_id: z.string(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const comment_mentionsCreateManyInputObjectZodSchema = z.object({
  comment_id: z.string(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
