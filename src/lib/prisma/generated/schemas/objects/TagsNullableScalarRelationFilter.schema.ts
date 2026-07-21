// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereInputObjectSchema } from './tagsWhereInput.schema'

export const TagsNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.TagsNullableScalarRelationFilter, Prisma.TagsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => tagsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => tagsWhereInputObjectSchema).optional().nullable()
}).strict();
export const TagsNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => tagsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => tagsWhereInputObjectSchema).optional().nullable()
}).strict();
