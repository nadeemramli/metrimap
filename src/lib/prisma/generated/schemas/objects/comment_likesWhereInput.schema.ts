// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { CommentsScalarRelationFilterObjectSchema } from './CommentsScalarRelationFilter.schema';
import { commentsWhereInputObjectSchema } from './commentsWhereInput.schema'

export const comment_likesWhereInputObjectSchema: z.ZodType<Prisma.comment_likesWhereInput, Prisma.comment_likesWhereInput> = z.object({
  AND: z.union([z.lazy(() => comment_likesWhereInputObjectSchema), z.lazy(() => comment_likesWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_likesWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_likesWhereInputObjectSchema), z.lazy(() => comment_likesWhereInputObjectSchema).array()]).optional(),
  comment_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  comments: z.union([z.lazy(() => CommentsScalarRelationFilterObjectSchema), z.lazy(() => commentsWhereInputObjectSchema)]).optional()
}).strict();
export const comment_likesWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => comment_likesWhereInputObjectSchema), z.lazy(() => comment_likesWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_likesWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_likesWhereInputObjectSchema), z.lazy(() => comment_likesWhereInputObjectSchema).array()]).optional(),
  comment_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  comments: z.union([z.lazy(() => CommentsScalarRelationFilterObjectSchema), z.lazy(() => commentsWhereInputObjectSchema)]).optional()
}).strict();
