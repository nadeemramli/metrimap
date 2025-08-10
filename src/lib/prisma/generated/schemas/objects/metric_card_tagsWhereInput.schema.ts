import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

export const metric_card_tagsWhereInputObjectSchema: z.ZodType<Prisma.metric_card_tagsWhereInput, Prisma.metric_card_tagsWhereInput> = z.object({
  AND: z.union([z.lazy(() => metric_card_tagsWhereInputObjectSchema), z.lazy(() => metric_card_tagsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_card_tagsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_card_tagsWhereInputObjectSchema), z.lazy(() => metric_card_tagsWhereInputObjectSchema).array()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable()
}).strict();
export const metric_card_tagsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => metric_card_tagsWhereInputObjectSchema), z.lazy(() => metric_card_tagsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_card_tagsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_card_tagsWhereInputObjectSchema), z.lazy(() => metric_card_tagsWhereInputObjectSchema).array()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.iso.datetime()])]).optional().nullable()
}).strict();
