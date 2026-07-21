// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { Comment_likesListRelationFilterObjectSchema } from './Comment_likesListRelationFilter.schema';
import { Comment_mentionsListRelationFilterObjectSchema } from './Comment_mentionsListRelationFilter.schema';
import { CommentsNullableScalarRelationFilterObjectSchema } from './CommentsNullableScalarRelationFilter.schema';
import { CommentsListRelationFilterObjectSchema } from './CommentsListRelationFilter.schema';
import { Comment_threadsScalarRelationFilterObjectSchema } from './Comment_threadsScalarRelationFilter.schema';
import { comment_threadsWhereInputObjectSchema } from './comment_threadsWhereInput.schema'

export const commentsWhereInputObjectSchema: z.ZodType<Prisma.commentsWhereInput, Prisma.commentsWhereInput> = z.object({
  AND: z.union([z.lazy(() => commentsWhereInputObjectSchema), z.lazy(() => commentsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => commentsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => commentsWhereInputObjectSchema), z.lazy(() => commentsWhereInputObjectSchema).array()]).optional(),
  thread_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  author_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  content: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  resolved: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  parent_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  comment_likes: z.lazy(() => Comment_likesListRelationFilterObjectSchema).optional(),
  comment_mentions: z.lazy(() => Comment_mentionsListRelationFilterObjectSchema).optional(),
  comments: z.union([z.lazy(() => CommentsNullableScalarRelationFilterObjectSchema), z.lazy(() => commentsWhereInputObjectSchema)]).optional().nullable(),
  other_comments: z.lazy(() => CommentsListRelationFilterObjectSchema).optional(),
  comment_threads: z.union([z.lazy(() => Comment_threadsScalarRelationFilterObjectSchema), z.lazy(() => comment_threadsWhereInputObjectSchema)]).optional()
}).strict();
export const commentsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => commentsWhereInputObjectSchema), z.lazy(() => commentsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => commentsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => commentsWhereInputObjectSchema), z.lazy(() => commentsWhereInputObjectSchema).array()]).optional(),
  thread_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  author_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  content: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  resolved: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  parent_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  comment_likes: z.lazy(() => Comment_likesListRelationFilterObjectSchema).optional(),
  comment_mentions: z.lazy(() => Comment_mentionsListRelationFilterObjectSchema).optional(),
  comments: z.union([z.lazy(() => CommentsNullableScalarRelationFilterObjectSchema), z.lazy(() => commentsWhereInputObjectSchema)]).optional().nullable(),
  other_comments: z.lazy(() => CommentsListRelationFilterObjectSchema).optional(),
  comment_threads: z.union([z.lazy(() => Comment_threadsScalarRelationFilterObjectSchema), z.lazy(() => comment_threadsWhereInputObjectSchema)]).optional()
}).strict();
