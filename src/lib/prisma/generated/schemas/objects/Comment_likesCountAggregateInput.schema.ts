// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Comment_likesCountAggregateInputObjectSchema: z.ZodType<Prisma.Comment_likesCountAggregateInputType, Prisma.Comment_likesCountAggregateInputType> = z.object({
  comment_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Comment_likesCountAggregateInputObjectZodSchema = z.object({
  comment_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
