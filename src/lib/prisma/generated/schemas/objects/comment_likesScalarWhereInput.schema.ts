// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

export const comment_likesScalarWhereInputObjectSchema: z.ZodType<Prisma.comment_likesScalarWhereInput, Prisma.comment_likesScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => comment_likesScalarWhereInputObjectSchema), z.lazy(() => comment_likesScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_likesScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_likesScalarWhereInputObjectSchema), z.lazy(() => comment_likesScalarWhereInputObjectSchema).array()]).optional(),
  comment_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const comment_likesScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => comment_likesScalarWhereInputObjectSchema), z.lazy(() => comment_likesScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => comment_likesScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => comment_likesScalarWhereInputObjectSchema), z.lazy(() => comment_likesScalarWhereInputObjectSchema).array()]).optional(),
  comment_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  user_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
