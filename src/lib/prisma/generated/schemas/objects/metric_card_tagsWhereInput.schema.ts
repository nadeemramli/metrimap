// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidNullableFilterObjectSchema } from './UuidNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { Metric_cardsNullableScalarRelationFilterObjectSchema } from './Metric_cardsNullableScalarRelationFilter.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { TagsNullableScalarRelationFilterObjectSchema } from './TagsNullableScalarRelationFilter.schema';
import { tagsWhereInputObjectSchema } from './tagsWhereInput.schema'

export const metric_card_tagsWhereInputObjectSchema: z.ZodType<Prisma.metric_card_tagsWhereInput, Prisma.metric_card_tagsWhereInput> = z.object({
  AND: z.union([z.lazy(() => metric_card_tagsWhereInputObjectSchema), z.lazy(() => metric_card_tagsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_card_tagsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_card_tagsWhereInputObjectSchema), z.lazy(() => metric_card_tagsWhereInputObjectSchema).array()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  metric_cards: z.union([z.lazy(() => Metric_cardsNullableScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional().nullable(),
  tags: z.union([z.lazy(() => TagsNullableScalarRelationFilterObjectSchema), z.lazy(() => tagsWhereInputObjectSchema)]).optional().nullable()
}).strict();
export const metric_card_tagsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => metric_card_tagsWhereInputObjectSchema), z.lazy(() => metric_card_tagsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => metric_card_tagsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => metric_card_tagsWhereInputObjectSchema), z.lazy(() => metric_card_tagsWhereInputObjectSchema).array()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  tag_id: z.union([z.lazy(() => UuidNullableFilterObjectSchema), z.string()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional().nullable(),
  metric_cards: z.union([z.lazy(() => Metric_cardsNullableScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional().nullable(),
  tags: z.union([z.lazy(() => TagsNullableScalarRelationFilterObjectSchema), z.lazy(() => tagsWhereInputObjectSchema)]).optional().nullable()
}).strict();
