// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Comment_likesMaxAggregateInputObjectSchema: z.ZodType<Prisma.Comment_likesMaxAggregateInputType, Prisma.Comment_likesMaxAggregateInputType> = z.object({
  comment_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Comment_likesMaxAggregateInputObjectZodSchema = z.object({
  comment_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
