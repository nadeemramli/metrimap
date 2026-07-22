// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const relationship_tagsScalarWhereInputObjectSchema: z.ZodType<Prisma.relationship_tagsScalarWhereInput, Prisma.relationship_tagsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => relationship_tagsScalarWhereInputObjectSchema), z.lazy(() => relationship_tagsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationship_tagsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationship_tagsScalarWhereInputObjectSchema), z.lazy(() => relationship_tagsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
export const relationship_tagsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => relationship_tagsScalarWhereInputObjectSchema), z.lazy(() => relationship_tagsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationship_tagsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationship_tagsScalarWhereInputObjectSchema), z.lazy(() => relationship_tagsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
