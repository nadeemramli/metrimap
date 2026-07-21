// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsCreateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsCreateWithoutMetric_card_tagsInput.schema';
import { metric_cardsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutMetric_card_tagsInput.schema'

export const metric_cardsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateOrConnectWithoutMetric_card_tagsInput, Prisma.metric_cardsCreateOrConnectWithoutMetric_card_tagsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)])
}).strict();
export const metric_cardsCreateOrConnectWithoutMetric_card_tagsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)])
}).strict();
