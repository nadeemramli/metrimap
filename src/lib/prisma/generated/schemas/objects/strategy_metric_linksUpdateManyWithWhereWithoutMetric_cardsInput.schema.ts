// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksScalarWhereInputObjectSchema } from './strategy_metric_linksScalarWhereInput.schema';
import { strategy_metric_linksUpdateManyMutationInputObjectSchema } from './strategy_metric_linksUpdateManyMutationInput.schema';
import { strategy_metric_linksUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksUncheckedUpdateManyWithoutMetric_cardsInput.schema'

export const strategy_metric_linksUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksUpdateManyWithWhereWithoutMetric_cardsInput, Prisma.strategy_metric_linksUpdateManyWithWhereWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => strategy_metric_linksUpdateManyMutationInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const strategy_metric_linksUpdateManyWithWhereWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => strategy_metric_linksUpdateManyMutationInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema)])
}).strict();
