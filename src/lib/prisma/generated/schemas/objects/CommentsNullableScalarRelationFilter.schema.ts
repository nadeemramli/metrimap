// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereInputObjectSchema } from './commentsWhereInput.schema'

export const CommentsNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.CommentsNullableScalarRelationFilter, Prisma.CommentsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => commentsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => commentsWhereInputObjectSchema).optional().nullable()
}).strict();
export const CommentsNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => commentsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => commentsWhereInputObjectSchema).optional().nullable()
}).strict();
