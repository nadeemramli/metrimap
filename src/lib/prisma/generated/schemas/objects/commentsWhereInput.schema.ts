import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const commentsWhereInputObjectSchema: z.ZodType<Prisma.commentsWhereInput, Prisma.commentsWhereInput> = z.object({
  AND: z.union([z.lazy(() => commentsWhereInputObjectSchema), z.lazy(() => commentsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => commentsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => commentsWhereInputObjectSchema), z.lazy(() => commentsWhereInputObjectSchema).array()]).optional(),
  thread_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  author_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  content: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  resolved: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional()
}).strict();
export const commentsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => commentsWhereInputObjectSchema), z.lazy(() => commentsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => commentsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => commentsWhereInputObjectSchema), z.lazy(() => commentsWhereInputObjectSchema).array()]).optional(),
  thread_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  author_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  content: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  resolved: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional()
}).strict();
