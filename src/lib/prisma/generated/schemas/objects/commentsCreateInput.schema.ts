import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const commentsCreateInputObjectSchema: z.ZodType<Prisma.commentsCreateInput, Prisma.commentsCreateInput> = z.object({
  thread_id: z.string(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional()
}).strict();
export const commentsCreateInputObjectZodSchema = z.object({
  thread_id: z.string(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional()
}).strict();
