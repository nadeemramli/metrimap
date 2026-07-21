// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsUpdateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsUpdateWithoutMetric_card_tagsInput.schema';
import { metric_cardsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutMetric_card_tagsInput.schema';
import { metric_cardsCreateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsCreateWithoutMetric_card_tagsInput.schema';
import { metric_cardsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutMetric_card_tagsInput.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema'

export const metric_cardsUpsertWithoutMetric_card_tagsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpsertWithoutMetric_card_tagsInput, Prisma.metric_cardsUpsertWithoutMetric_card_tagsInput> = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
export const metric_cardsUpsertWithoutMetric_card_tagsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
