// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Feed_bookmarksCountAggregateInputObjectSchema: z.ZodType<Prisma.Feed_bookmarksCountAggregateInputType, Prisma.Feed_bookmarksCountAggregateInputType> = z.object({
  user_id: z.literal(true).optional(),
  item_key: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Feed_bookmarksCountAggregateInputObjectZodSchema = z.object({
  user_id: z.literal(true).optional(),
  item_key: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
