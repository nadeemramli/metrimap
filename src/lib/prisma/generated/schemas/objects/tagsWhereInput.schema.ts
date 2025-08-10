import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const tagsWhereInputObjectSchema: z.ZodType<Prisma.tagsWhereInput, Prisma.tagsWhereInput> = z.object({
  AND: z.union([z.lazy(() => tagsWhereInputObjectSchema), z.lazy(() => tagsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tagsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tagsWhereInputObjectSchema), z.lazy(() => tagsWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable()
}).strict();
export const tagsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => tagsWhereInputObjectSchema), z.lazy(() => tagsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => tagsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => tagsWhereInputObjectSchema), z.lazy(() => tagsWhereInputObjectSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  project_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable(),
  updated_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable()
}).strict();
