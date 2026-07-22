// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereInputObjectSchema } from './commentsWhereInput.schema'

export const CommentsListRelationFilterObjectSchema: z.ZodType<Prisma.CommentsListRelationFilter, Prisma.CommentsListRelationFilter> = z.object({
  every: z.lazy(() => commentsWhereInputObjectSchema).optional(),
  some: z.lazy(() => commentsWhereInputObjectSchema).optional(),
  none: z.lazy(() => commentsWhereInputObjectSchema).optional()
}).strict();
export const CommentsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => commentsWhereInputObjectSchema).optional(),
  some: z.lazy(() => commentsWhereInputObjectSchema).optional(),
  none: z.lazy(() => commentsWhereInputObjectSchema).optional()
}).strict();
