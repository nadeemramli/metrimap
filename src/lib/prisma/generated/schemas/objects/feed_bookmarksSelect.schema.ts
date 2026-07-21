// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const feed_bookmarksSelectObjectSchema: z.ZodType<Prisma.feed_bookmarksSelect, Prisma.feed_bookmarksSelect> = z.object({
  user_id: z.boolean().optional(),
  item_key: z.boolean().optional(),
  created_at: z.boolean().optional()
}).strict();
export const feed_bookmarksSelectObjectZodSchema = z.object({
  user_id: z.boolean().optional(),
  item_key: z.boolean().optional(),
  created_at: z.boolean().optional()
}).strict();
