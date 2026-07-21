// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Feed_bookmarksMinAggregateInputObjectSchema: z.ZodType<Prisma.Feed_bookmarksMinAggregateInputType, Prisma.Feed_bookmarksMinAggregateInputType> = z.object({
  user_id: z.literal(true).optional(),
  item_key: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Feed_bookmarksMinAggregateInputObjectZodSchema = z.object({
  user_id: z.literal(true).optional(),
  item_key: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
