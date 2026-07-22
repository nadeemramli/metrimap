// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema'

export const api_keysScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.api_keysScalarWhereWithAggregatesInput, Prisma.api_keysScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => api_keysScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => api_keysScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => api_keysScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => api_keysScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => api_keysScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  key_prefix: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  key_hash: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  last_used_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
export const api_keysScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => api_keysScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => api_keysScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => api_keysScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => api_keysScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => api_keysScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  key_prefix: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  key_hash: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  last_used_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
