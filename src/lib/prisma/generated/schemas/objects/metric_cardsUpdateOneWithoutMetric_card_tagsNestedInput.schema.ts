// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsCreateWithoutMetric_card_tagsInput.schema';
import { metric_cardsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutMetric_card_tagsInput.schema';
import { metric_cardsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutMetric_card_tagsInput.schema';
import { metric_cardsUpsertWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsUpsertWithoutMetric_card_tagsInput.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateToOneWithWhereWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsUpdateToOneWithWhereWithoutMetric_card_tagsInput.schema';
import { metric_cardsUpdateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsUpdateWithoutMetric_card_tagsInput.schema';
import { metric_cardsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutMetric_card_tagsInput.schema'

export const metric_cardsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateOneWithoutMetric_card_tagsNestedInput, Prisma.metric_cardsUpdateOneWithoutMetric_card_tagsNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutMetric_card_tagsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema)]).optional()
}).strict();
export const metric_cardsUpdateOneWithoutMetric_card_tagsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutMetric_card_tagsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema)]).optional()
}).strict();
