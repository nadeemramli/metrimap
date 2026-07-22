// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksWhereUniqueInputObjectSchema } from './strategy_metric_linksWhereUniqueInput.schema';
import { strategy_metric_linksUpdateWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksUpdateWithoutTracked_metricsInput.schema';
import { strategy_metric_linksUncheckedUpdateWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksUncheckedUpdateWithoutTracked_metricsInput.schema'

export const strategy_metric_linksUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksUpdateWithWhereUniqueWithoutTracked_metricsInput, Prisma.strategy_metric_linksUpdateWithWhereUniqueWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => strategy_metric_linksUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const strategy_metric_linksUpdateWithWhereUniqueWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => strategy_metric_linksUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateWithoutTracked_metricsInputObjectSchema)])
}).strict();
