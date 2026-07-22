// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsWhereUniqueInputObjectSchema } from './node_access_grantsWhereUniqueInput.schema';
import { node_access_grantsUpdateWithoutMetric_cardsInputObjectSchema } from './node_access_grantsUpdateWithoutMetric_cardsInput.schema';
import { node_access_grantsUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './node_access_grantsUncheckedUpdateWithoutMetric_cardsInput.schema'

export const node_access_grantsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.node_access_grantsUpdateWithWhereUniqueWithoutMetric_cardsInput, Prisma.node_access_grantsUpdateWithWhereUniqueWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => node_access_grantsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const node_access_grantsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => node_access_grantsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
