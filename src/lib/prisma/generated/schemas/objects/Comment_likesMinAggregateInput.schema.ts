// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Comment_likesMinAggregateInputObjectSchema: z.ZodType<Prisma.Comment_likesMinAggregateInputType, Prisma.Comment_likesMinAggregateInputType> = z.object({
  comment_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Comment_likesMinAggregateInputObjectZodSchema = z.object({
  comment_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
