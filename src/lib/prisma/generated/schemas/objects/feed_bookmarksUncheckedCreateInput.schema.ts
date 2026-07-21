// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const feed_bookmarksUncheckedCreateInputObjectSchema: z.ZodType<Prisma.feed_bookmarksUncheckedCreateInput, Prisma.feed_bookmarksUncheckedCreateInput> = z.object({
  user_id: z.string().optional(),
  item_key: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const feed_bookmarksUncheckedCreateInputObjectZodSchema = z.object({
  user_id: z.string().optional(),
  item_key: z.string(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
