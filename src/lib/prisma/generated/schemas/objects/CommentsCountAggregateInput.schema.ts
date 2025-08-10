import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const CommentsCountAggregateInputObjectSchema: z.ZodType<Prisma.CommentsCountAggregateInputType, Prisma.CommentsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  thread_id: z.literal(true).optional(),
  author_id: z.literal(true).optional(),
  content: z.literal(true).optional(),
  resolved: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const CommentsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  thread_id: z.literal(true).optional(),
  author_id: z.literal(true).optional(),
  content: z.literal(true).optional(),
  resolved: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
