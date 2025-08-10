import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const CommentsMaxAggregateInputObjectSchema: z.ZodType<Prisma.CommentsMaxAggregateInputType, Prisma.CommentsMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  thread_id: z.literal(true).optional(),
  author_id: z.literal(true).optional(),
  content: z.literal(true).optional(),
  resolved: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const CommentsMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  thread_id: z.literal(true).optional(),
  author_id: z.literal(true).optional(),
  content: z.literal(true).optional(),
  resolved: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
