// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereInputObjectSchema } from './commentsWhereInput.schema'

export const CommentsScalarRelationFilterObjectSchema: z.ZodType<Prisma.CommentsScalarRelationFilter, Prisma.CommentsScalarRelationFilter> = z.object({
  is: z.lazy(() => commentsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => commentsWhereInputObjectSchema).optional()
}).strict();
export const CommentsScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => commentsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => commentsWhereInputObjectSchema).optional()
}).strict();
