// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsCreateWithoutMetric_cardsInput.schema';
import { metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsUncheckedCreateWithoutMetric_cardsInput.schema';
import { metric_card_tagsCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsCreateOrConnectWithoutMetric_cardsInput.schema';
import { metric_card_tagsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsUpsertWithWhereUniqueWithoutMetric_cardsInput.schema';
import { metric_card_tagsCreateManyMetric_cardsInputEnvelopeObjectSchema } from './metric_card_tagsCreateManyMetric_cardsInputEnvelope.schema';
import { metric_card_tagsWhereUniqueInputObjectSchema } from './metric_card_tagsWhereUniqueInput.schema';
import { metric_card_tagsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsUpdateWithWhereUniqueWithoutMetric_cardsInput.schema';
import { metric_card_tagsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsUpdateManyWithWhereWithoutMetric_cardsInput.schema';
import { metric_card_tagsScalarWhereInputObjectSchema } from './metric_card_tagsScalarWhereInput.schema'

export const metric_card_tagsUpdateManyWithoutMetric_cardsNestedInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUpdateManyWithoutMetric_cardsNestedInput, Prisma.metric_card_tagsUpdateManyWithoutMetric_cardsNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_card_tagsCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_card_tagsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_card_tagsCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_card_tagsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_card_tagsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema), z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const metric_card_tagsUpdateManyWithoutMetric_cardsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_card_tagsCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_card_tagsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_card_tagsCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema), z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_card_tagsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_card_tagsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => metric_card_tagsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema), z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
