// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const comment_mentionsScalarWhereInputObjectSchema: z.ZodType<Prisma.comment_mentionsScalarWhereInput, Prisma.comment_mentionsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => comment_mentionsScalarWhereInputObjectSchema), z.lazy(() => comment_mentionsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_mentionsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_mentionsScalarWhereInputObjectSchema), z.lazy(() => comment_mentionsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  comment_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  mentioned_user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const comment_mentionsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => comment_mentionsScalarWhereInputObjectSchema), z.lazy(() => comment_mentionsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_mentionsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_mentionsScalarWhereInputObjectSchema), z.lazy(() => comment_mentionsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  comment_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  mentioned_user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
