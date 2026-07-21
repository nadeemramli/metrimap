// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsCreateWithoutMetric_card_tagsInput.schema';
import { metric_cardsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutMetric_card_tagsInput.schema';
import { metric_cardsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutMetric_card_tagsInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema'

export const metric_cardsCreateNestedOneWithoutMetric_card_tagsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateNestedOneWithoutMetric_card_tagsInput, Prisma.metric_cardsCreateNestedOneWithoutMetric_card_tagsInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
export const metric_cardsCreateNestedOneWithoutMetric_card_tagsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
