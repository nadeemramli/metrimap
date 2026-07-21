// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsWhereUniqueInputObjectSchema } from './metric_card_tagsWhereUniqueInput.schema';
import { metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsCreateWithoutMetric_cardsInput.schema';
import { metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsUncheckedCreateWithoutMetric_cardsInput.schema'

export const metric_card_tagsCreateOrConnectWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsCreateOrConnectWithoutMetric_cardsInput, Prisma.metric_card_tagsCreateOrConnectWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const metric_card_tagsCreateOrConnectWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
