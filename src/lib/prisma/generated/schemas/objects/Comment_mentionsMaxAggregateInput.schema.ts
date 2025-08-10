import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Comment_mentionsMaxAggregateInputObjectSchema: z.ZodType<Prisma.Comment_mentionsMaxAggregateInputType, Prisma.Comment_mentionsMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  comment_id: z.literal(true).optional(),
  mentioned_user_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Comment_mentionsMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  comment_id: z.literal(true).optional(),
  mentioned_user_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
