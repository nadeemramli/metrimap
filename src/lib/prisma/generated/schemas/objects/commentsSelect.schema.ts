import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const commentsSelectObjectSchema: z.ZodType<Prisma.commentsSelect, Prisma.commentsSelect> = z.object({
  id: z.boolean().optional(),
  thread_id: z.boolean().optional(),
  author_id: z.boolean().optional(),
  content: z.boolean().optional(),
  resolved: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional()
}).strict();
export const commentsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  thread_id: z.boolean().optional(),
  author_id: z.boolean().optional(),
  content: z.boolean().optional(),
  resolved: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional()
}).strict();
