// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const feed_bookmarksWhereInputObjectSchema: z.ZodType<Prisma.feed_bookmarksWhereInput, Prisma.feed_bookmarksWhereInput> = z.object({
  AND: z.union([z.lazy(() => feed_bookmarksWhereInputObjectSchema), z.lazy(() => feed_bookmarksWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => feed_bookmarksWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => feed_bookmarksWhereInputObjectSchema), z.lazy(() => feed_bookmarksWhereInputObjectSchema).array()]).optional(),
  user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  item_key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const feed_bookmarksWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => feed_bookmarksWhereInputObjectSchema), z.lazy(() => feed_bookmarksWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => feed_bookmarksWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => feed_bookmarksWhereInputObjectSchema), z.lazy(() => feed_bookmarksWhereInputObjectSchema).array()]).optional(),
  user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  item_key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
