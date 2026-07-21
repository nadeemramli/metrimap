// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema'

export const commentsScalarWhereInputObjectSchema: z.ZodType<Prisma.commentsScalarWhereInput, Prisma.commentsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => commentsScalarWhereInputObjectSchema), z.lazy(() => commentsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => commentsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => commentsScalarWhereInputObjectSchema), z.lazy(() => commentsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  thread_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  author_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  content: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  resolved: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  parent_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const commentsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => commentsScalarWhereInputObjectSchema), z.lazy(() => commentsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => commentsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => commentsScalarWhereInputObjectSchema), z.lazy(() => commentsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  thread_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  author_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  content: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  resolved: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  parent_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
