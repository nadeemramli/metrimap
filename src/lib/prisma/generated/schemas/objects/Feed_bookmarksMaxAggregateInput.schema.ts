// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Feed_bookmarksMaxAggregateInputObjectSchema: z.ZodType<Prisma.Feed_bookmarksMaxAggregateInputType, Prisma.Feed_bookmarksMaxAggregateInputType> = z.object({
  user_id: z.literal(true).optional(),
  item_key: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Feed_bookmarksMaxAggregateInputObjectZodSchema = z.object({
  user_id: z.literal(true).optional(),
  item_key: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
