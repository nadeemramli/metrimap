// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const api_keysWhereInputObjectSchema: z.ZodType<Prisma.api_keysWhereInput, Prisma.api_keysWhereInput> = z.object({
  AND: z.union([z.lazy(() => api_keysWhereInputObjectSchema), z.lazy(() => api_keysWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => api_keysWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => api_keysWhereInputObjectSchema), z.lazy(() => api_keysWhereInputObjectSchema).array()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key_prefix: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key_hash: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  last_used_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
export const api_keysWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => api_keysWhereInputObjectSchema), z.lazy(() => api_keysWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => api_keysWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => api_keysWhereInputObjectSchema), z.lazy(() => api_keysWhereInputObjectSchema).array()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key_prefix: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key_hash: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  last_used_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
