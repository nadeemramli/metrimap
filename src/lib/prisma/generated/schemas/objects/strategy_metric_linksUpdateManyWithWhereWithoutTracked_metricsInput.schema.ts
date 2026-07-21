// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksScalarWhereInputObjectSchema } from './strategy_metric_linksScalarWhereInput.schema';
import { strategy_metric_linksUpdateManyMutationInputObjectSchema } from './strategy_metric_linksUpdateManyMutationInput.schema';
import { strategy_metric_linksUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksUncheckedUpdateManyWithoutTracked_metricsInput.schema'

export const strategy_metric_linksUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksUpdateManyWithWhereWithoutTracked_metricsInput, Prisma.strategy_metric_linksUpdateManyWithWhereWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => strategy_metric_linksUpdateManyMutationInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const strategy_metric_linksUpdateManyWithWhereWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => strategy_metric_linksUpdateManyMutationInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema)])
}).strict();
