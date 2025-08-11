import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_mentionsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.comment_mentionsUncheckedCreateInput, Prisma.comment_mentionsUncheckedCreateInput> = z.object({
  comment_id: z.string(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const comment_mentionsUncheckedCreateInputObjectZodSchema = z.object({
  comment_id: z.string(),
  mentioned_user_id: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
