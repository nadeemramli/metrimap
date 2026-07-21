// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const feed_bookmarksCreateInputObjectSchema: z.ZodType<Prisma.feed_bookmarksCreateInput, Prisma.feed_bookmarksCreateInput> = z.object({
  user_id: z.string().optional(),
  item_key: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const feed_bookmarksCreateInputObjectZodSchema = z.object({
  user_id: z.string().optional(),
  item_key: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
