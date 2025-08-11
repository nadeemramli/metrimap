import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidNullableWithAggregatesFilterObjectSchema } from './UuidNullableWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema'

export const relationship_tagsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.relationship_tagsScalarWhereWithAggregatesInput, Prisma.relationship_tagsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => relationship_tagsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => relationship_tagsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationship_tagsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationship_tagsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => relationship_tagsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
export const relationship_tagsScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => relationship_tagsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => relationship_tagsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => relationship_tagsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => relationship_tagsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => relationship_tagsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  relationship_id: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
