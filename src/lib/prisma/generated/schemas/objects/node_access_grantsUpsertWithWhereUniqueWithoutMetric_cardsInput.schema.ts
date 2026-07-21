// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsWhereUniqueInputObjectSchema } from './node_access_grantsWhereUniqueInput.schema';
import { node_access_grantsUpdateWithoutMetric_cardsInputObjectSchema } from './node_access_grantsUpdateWithoutMetric_cardsInput.schema';
import { node_access_grantsUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './node_access_grantsUncheckedUpdateWithoutMetric_cardsInput.schema';
import { node_access_grantsCreateWithoutMetric_cardsInputObjectSchema } from './node_access_grantsCreateWithoutMetric_cardsInput.schema';
import { node_access_grantsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './node_access_grantsUncheckedCreateWithoutMetric_cardsInput.schema'

export const node_access_grantsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.node_access_grantsUpsertWithWhereUniqueWithoutMetric_cardsInput, Prisma.node_access_grantsUpsertWithWhereUniqueWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => node_access_grantsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => node_access_grantsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const node_access_grantsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => node_access_grantsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => node_access_grantsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
