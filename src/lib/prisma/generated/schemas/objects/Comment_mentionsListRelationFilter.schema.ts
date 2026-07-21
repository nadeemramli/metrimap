// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_mentionsWhereInputObjectSchema } from './comment_mentionsWhereInput.schema'

export const Comment_mentionsListRelationFilterObjectSchema: z.ZodType<Prisma.Comment_mentionsListRelationFilter, Prisma.Comment_mentionsListRelationFilter> = z.object({
  every: z.lazy(() => comment_mentionsWhereInputObjectSchema).optional(),
  some: z.lazy(() => comment_mentionsWhereInputObjectSchema).optional(),
  none: z.lazy(() => comment_mentionsWhereInputObjectSchema).optional()
}).strict();
export const Comment_mentionsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => comment_mentionsWhereInputObjectSchema).optional(),
  some: z.lazy(() => comment_mentionsWhereInputObjectSchema).optional(),
  none: z.lazy(() => comment_mentionsWhereInputObjectSchema).optional()
}).strict();
