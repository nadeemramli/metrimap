// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { feed_bookmarksSelectObjectSchema } from './feed_bookmarksSelect.schema'

export const feed_bookmarksArgsObjectSchema = z.object({
  select: z.lazy(() => feed_bookmarksSelectObjectSchema).optional()
}).strict();
export const feed_bookmarksArgsObjectZodSchema = z.object({
  select: z.lazy(() => feed_bookmarksSelectObjectSchema).optional()
}).strict();
