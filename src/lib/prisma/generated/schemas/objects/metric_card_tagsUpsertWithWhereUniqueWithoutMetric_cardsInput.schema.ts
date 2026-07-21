// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsWhereUniqueInputObjectSchema } from './metric_card_tagsWhereUniqueInput.schema';
import { metric_card_tagsUpdateWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsUpdateWithoutMetric_cardsInput.schema';
import { metric_card_tagsUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsUncheckedUpdateWithoutMetric_cardsInput.schema';
import { metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsCreateWithoutMetric_cardsInput.schema';
import { metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsUncheckedCreateWithoutMetric_cardsInput.schema'

export const metric_card_tagsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUpsertWithWhereUniqueWithoutMetric_cardsInput, Prisma.metric_card_tagsUpsertWithWhereUniqueWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => metric_card_tagsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const metric_card_tagsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => metric_card_tagsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
