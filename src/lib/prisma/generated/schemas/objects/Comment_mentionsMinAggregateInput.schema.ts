import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Comment_mentionsMinAggregateInputObjectSchema: z.ZodType<Prisma.Comment_mentionsMinAggregateInputType, Prisma.Comment_mentionsMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  comment_id: z.literal(true).optional(),
  mentioned_user_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Comment_mentionsMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  comment_id: z.literal(true).optional(),
  mentioned_user_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
