// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const commentsCreateManyComment_threadsInputObjectSchema: z.ZodType<Prisma.commentsCreateManyComment_threadsInput, Prisma.commentsCreateManyComment_threadsInput> = z.object({
  id: z.string().optional(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  parent_id: z.string().optional().nullable()
}).strict();
export const commentsCreateManyComment_threadsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  author_id: z.string().optional().nullable(),
  content: z.string(),
  resolved: z.boolean().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  parent_id: z.string().optional().nullable()
}).strict();
