// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksWhereUniqueInputObjectSchema } from './strategy_metric_linksWhereUniqueInput.schema';
import { strategy_metric_linksUpdateWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksUpdateWithoutTracked_metricsInput.schema';
import { strategy_metric_linksUncheckedUpdateWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksUncheckedUpdateWithoutTracked_metricsInput.schema';
import { strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksCreateWithoutTracked_metricsInput.schema';
import { strategy_metric_linksUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksUncheckedCreateWithoutTracked_metricsInput.schema'

export const strategy_metric_linksUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksUpsertWithWhereUniqueWithoutTracked_metricsInput, Prisma.strategy_metric_linksUpsertWithWhereUniqueWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => strategy_metric_linksUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateWithoutTracked_metricsInputObjectSchema)]),
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const strategy_metric_linksUpsertWithWhereUniqueWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => strategy_metric_linksUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateWithoutTracked_metricsInputObjectSchema)]),
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutTracked_metricsInputObjectSchema)])
}).strict();
