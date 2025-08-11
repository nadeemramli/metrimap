import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const relationship_tagsWhereInputObjectSchema: z.ZodType<Prisma.relationship_tagsWhereInput, Prisma.relationship_tagsWhereInput> = z.object({
  AND: z.union([z.lazy(() => relationship_tagsWhereInputObjectSchema), z.lazy(() => relationship_tagsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationship_tagsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationship_tagsWhereInputObjectSchema), z.lazy(() => relationship_tagsWhereInputObjectSchema).array()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
export const relationship_tagsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => relationship_tagsWhereInputObjectSchema), z.lazy(() => relationship_tagsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationship_tagsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationship_tagsWhereInputObjectSchema), z.lazy(() => relationship_tagsWhereInputObjectSchema).array()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
