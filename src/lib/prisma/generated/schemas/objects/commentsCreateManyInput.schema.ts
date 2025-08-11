import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const commentsCreateManyInputObjectSchema: z.ZodType<Prisma.commentsCreateManyInput, Prisma.commentsCreateManyInput> = z.object({
  thread_id: z.string(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const commentsCreateManyInputObjectZodSchema = z.object({
  thread_id: z.string(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
