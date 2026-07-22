// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsWhereInputObjectSchema } from './comment_threadsWhereInput.schema'

export const Comment_threadsListRelationFilterObjectSchema: z.ZodType<Prisma.Comment_threadsListRelationFilter, Prisma.Comment_threadsListRelationFilter> = z.object({
  every: z.lazy(() => comment_threadsWhereInputObjectSchema).optional(),
  some: z.lazy(() => comment_threadsWhereInputObjectSchema).optional(),
  none: z.lazy(() => comment_threadsWhereInputObjectSchema).optional()
}).strict();
export const Comment_threadsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => comment_threadsWhereInputObjectSchema).optional(),
  some: z.lazy(() => comment_threadsWhereInputObjectSchema).optional(),
  none: z.lazy(() => comment_threadsWhereInputObjectSchema).optional()
}).strict();
