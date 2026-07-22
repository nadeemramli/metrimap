// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const metric_card_tagsScalarWhereInputObjectSchema: z.ZodType<Prisma.metric_card_tagsScalarWhereInput, Prisma.metric_card_tagsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema), z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema), z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
export const metric_card_tagsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema), z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema), z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
