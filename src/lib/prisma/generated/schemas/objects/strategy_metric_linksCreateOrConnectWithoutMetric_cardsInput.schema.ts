// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksWhereUniqueInputObjectSchema } from './strategy_metric_linksWhereUniqueInput.schema';
import { strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksCreateWithoutMetric_cardsInput.schema';
import { strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksUncheckedCreateWithoutMetric_cardsInput.schema'

export const strategy_metric_linksCreateOrConnectWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksCreateOrConnectWithoutMetric_cardsInput, Prisma.strategy_metric_linksCreateOrConnectWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const strategy_metric_linksCreateOrConnectWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
