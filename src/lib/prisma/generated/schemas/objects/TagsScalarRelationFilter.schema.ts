// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereInputObjectSchema } from './tagsWhereInput.schema'

export const TagsScalarRelationFilterObjectSchema: z.ZodType<Prisma.TagsScalarRelationFilter, Prisma.TagsScalarRelationFilter> = z.object({
  is: z.lazy(() => tagsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => tagsWhereInputObjectSchema).optional()
}).strict();
export const TagsScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => tagsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => tagsWhereInputObjectSchema).optional()
}).strict();
