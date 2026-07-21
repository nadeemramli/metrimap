// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const feed_bookmarksOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.feed_bookmarksOrderByWithRelationInput, Prisma.feed_bookmarksOrderByWithRelationInput> = z.object({
  user_id: SortOrderSchema.optional(),
  item_key: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const feed_bookmarksOrderByWithRelationInputObjectZodSchema = z.object({
  user_id: SortOrderSchema.optional(),
  item_key: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
