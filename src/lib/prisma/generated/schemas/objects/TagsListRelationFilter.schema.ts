// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereInputObjectSchema } from './tagsWhereInput.schema'

export const TagsListRelationFilterObjectSchema: z.ZodType<Prisma.TagsListRelationFilter, Prisma.TagsListRelationFilter> = z.object({
  every: z.lazy(() => tagsWhereInputObjectSchema).optional(),
  some: z.lazy(() => tagsWhereInputObjectSchema).optional(),
  none: z.lazy(() => tagsWhereInputObjectSchema).optional()
}).strict();
export const TagsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => tagsWhereInputObjectSchema).optional(),
  some: z.lazy(() => tagsWhereInputObjectSchema).optional(),
  none: z.lazy(() => tagsWhereInputObjectSchema).optional()
}).strict();
