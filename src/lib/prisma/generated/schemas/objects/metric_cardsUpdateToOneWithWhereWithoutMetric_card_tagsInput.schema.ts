// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { metric_cardsUpdateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsUpdateWithoutMetric_card_tagsInput.schema';
import { metric_cardsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutMetric_card_tagsInput.schema'

export const metric_cardsUpdateToOneWithWhereWithoutMetric_card_tagsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateToOneWithWhereWithoutMetric_card_tagsInput, Prisma.metric_cardsUpdateToOneWithWhereWithoutMetric_card_tagsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema)])
}).strict();
export const metric_cardsUpdateToOneWithWhereWithoutMetric_card_tagsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema)])
}).strict();
