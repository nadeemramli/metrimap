import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const commentsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.commentsUncheckedCreateInput, Prisma.commentsUncheckedCreateInput> = z.object({
  thread_id: z.string(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const commentsUncheckedCreateInputObjectZodSchema = z.object({
  thread_id: z.string(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
