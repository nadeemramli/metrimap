// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema'

export const tagsScalarWhereInputObjectSchema: z.ZodType<Prisma.tagsScalarWhereInput, Prisma.tagsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => tagsScalarWhereInputObjectSchema), z.lazy(() => tagsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tagsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tagsScalarWhereInputObjectSchema), z.lazy(() => tagsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  is_access: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  redaction_mode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const tagsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => tagsScalarWhereInputObjectSchema), z.lazy(() => tagsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tagsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tagsScalarWhereInputObjectSchema), z.lazy(() => tagsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  is_access: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  redaction_mode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
