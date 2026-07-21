// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksWhereUniqueInputObjectSchema } from './strategy_metric_linksWhereUniqueInput.schema';
import { strategy_metric_linksUpdateWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksUpdateWithoutMetric_cardsInput.schema';
import { strategy_metric_linksUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksUncheckedUpdateWithoutMetric_cardsInput.schema'

export const strategy_metric_linksUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksUpdateWithWhereUniqueWithoutMetric_cardsInput, Prisma.strategy_metric_linksUpdateWithWhereUniqueWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => strategy_metric_linksUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const strategy_metric_linksUpdateWithWhereUniqueWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => strategy_metric_linksUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
