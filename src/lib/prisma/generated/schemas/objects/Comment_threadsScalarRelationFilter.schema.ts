// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsWhereInputObjectSchema } from './comment_threadsWhereInput.schema'

export const Comment_threadsScalarRelationFilterObjectSchema: z.ZodType<Prisma.Comment_threadsScalarRelationFilter, Prisma.Comment_threadsScalarRelationFilter> = z.object({
  is: z.lazy(() => comment_threadsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => comment_threadsWhereInputObjectSchema).optional()
}).strict();
export const Comment_threadsScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => comment_threadsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => comment_threadsWhereInputObjectSchema).optional()
}).strict();
