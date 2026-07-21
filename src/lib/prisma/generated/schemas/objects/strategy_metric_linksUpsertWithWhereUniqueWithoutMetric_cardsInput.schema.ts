// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksWhereUniqueInputObjectSchema } from './strategy_metric_linksWhereUniqueInput.schema';
import { strategy_metric_linksUpdateWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksUpdateWithoutMetric_cardsInput.schema';
import { strategy_metric_linksUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksUncheckedUpdateWithoutMetric_cardsInput.schema';
import { strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksCreateWithoutMetric_cardsInput.schema';
import { strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksUncheckedCreateWithoutMetric_cardsInput.schema'

export const strategy_metric_linksUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksUpsertWithWhereUniqueWithoutMetric_cardsInput, Prisma.strategy_metric_linksUpsertWithWhereUniqueWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => strategy_metric_linksUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const strategy_metric_linksUpsertWithWhereUniqueWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => strategy_metric_linksUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
