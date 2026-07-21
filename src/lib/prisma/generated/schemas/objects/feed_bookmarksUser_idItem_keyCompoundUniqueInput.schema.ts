// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const feed_bookmarksUser_idItem_keyCompoundUniqueInputObjectSchema: z.ZodType<Prisma.feed_bookmarksUser_idItem_keyCompoundUniqueInput, Prisma.feed_bookmarksUser_idItem_keyCompoundUniqueInput> = z.object({
  user_id: z.string(),
  item_key: z.string()
}).strict();
export const feed_bookmarksUser_idItem_keyCompoundUniqueInputObjectZodSchema = z.object({
  user_id: z.string(),
  item_key: z.string()
}).strict();
