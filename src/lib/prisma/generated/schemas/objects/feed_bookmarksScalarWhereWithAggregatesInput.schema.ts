// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const feed_bookmarksScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.feed_bookmarksScalarWhereWithAggregatesInput, Prisma.feed_bookmarksScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => feed_bookmarksScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => feed_bookmarksScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => feed_bookmarksScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => feed_bookmarksScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => feed_bookmarksScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  user_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  item_key: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const feed_bookmarksScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => feed_bookmarksScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => feed_bookmarksScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => feed_bookmarksScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => feed_bookmarksScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => feed_bookmarksScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  user_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  item_key: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
