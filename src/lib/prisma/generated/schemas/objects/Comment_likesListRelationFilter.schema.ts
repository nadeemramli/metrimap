// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesWhereInputObjectSchema } from './comment_likesWhereInput.schema'

export const Comment_likesListRelationFilterObjectSchema: z.ZodType<Prisma.Comment_likesListRelationFilter, Prisma.Comment_likesListRelationFilter> = z.object({
  every: z.lazy(() => comment_likesWhereInputObjectSchema).optional(),
  some: z.lazy(() => comment_likesWhereInputObjectSchema).optional(),
  none: z.lazy(() => comment_likesWhereInputObjectSchema).optional()
}).strict();
export const Comment_likesListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => comment_likesWhereInputObjectSchema).optional(),
  some: z.lazy(() => comment_likesWhereInputObjectSchema).optional(),
  none: z.lazy(() => comment_likesWhereInputObjectSchema).optional()
}).strict();
