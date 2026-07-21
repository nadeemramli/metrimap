// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsCreateWithoutMetric_cardsInput.schema';
import { metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsUncheckedCreateWithoutMetric_cardsInput.schema';
import { metric_card_tagsCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsCreateOrConnectWithoutMetric_cardsInput.schema';
import { metric_card_tagsCreateManyMetric_cardsInputEnvelopeObjectSchema } from './metric_card_tagsCreateManyMetric_cardsInputEnvelope.schema';
import { metric_card_tagsWhereUniqueInputObjectSchema } from './metric_card_tagsWhereUniqueInput.schema'

export const metric_card_tagsUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUncheckedCreateNestedManyWithoutMetric_cardsInput, Prisma.metric_card_tagsUncheckedCreateNestedManyWithoutMetric_cardsInput> = z.object({
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_card_tagsCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_card_tagsCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const metric_card_tagsUncheckedCreateNestedManyWithoutMetric_cardsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_card_tagsCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_card_tagsCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
