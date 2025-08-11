import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidNullableWithAggregatesFilterObjectSchema } from './UuidNullableWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema'

export const metric_card_tagsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.metric_card_tagsScalarWhereWithAggregatesInput, Prisma.metric_card_tagsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => metric_card_tagsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => metric_card_tagsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_card_tagsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_card_tagsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => metric_card_tagsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
export const metric_card_tagsScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => metric_card_tagsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => metric_card_tagsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_card_tagsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_card_tagsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => metric_card_tagsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable()
}).strict();
