// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const feed_bookmarksCreateManyInputObjectSchema: z.ZodType<Prisma.feed_bookmarksCreateManyInput, Prisma.feed_bookmarksCreateManyInput> = z.object({
  user_id: z.string().optional(),
  item_key: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const feed_bookmarksCreateManyInputObjectZodSchema = z.object({
  user_id: z.string().optional(),
  item_key: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
