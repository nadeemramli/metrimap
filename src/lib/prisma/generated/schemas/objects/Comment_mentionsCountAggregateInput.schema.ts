import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Comment_mentionsCountAggregateInputObjectSchema: z.ZodType<Prisma.Comment_mentionsCountAggregateInputType, Prisma.Comment_mentionsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  comment_id: z.literal(true).optional(),
  mentioned_user_id: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Comment_mentionsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  comment_id: z.literal(true).optional(),
  mentioned_user_id: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
