// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { feed_bookmarksUser_idItem_keyCompoundUniqueInputObjectSchema } from './feed_bookmarksUser_idItem_keyCompoundUniqueInput.schema'

export const feed_bookmarksWhereUniqueInputObjectSchema: z.ZodType<Prisma.feed_bookmarksWhereUniqueInput, Prisma.feed_bookmarksWhereUniqueInput> = z.object({
  user_id_item_key: z.lazy(() => feed_bookmarksUser_idItem_keyCompoundUniqueInputObjectSchema)
}).strict();
export const feed_bookmarksWhereUniqueInputObjectZodSchema = z.object({
  user_id_item_key: z.lazy(() => feed_bookmarksUser_idItem_keyCompoundUniqueInputObjectSchema)
}).strict();
