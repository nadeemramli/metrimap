// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateWithoutTracked_metricsInputObjectSchema } from './metric_cardsUpdateWithoutTracked_metricsInput.schema';
import { metric_cardsUncheckedUpdateWithoutTracked_metricsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutTracked_metricsInput.schema'

export const metric_cardsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateWithWhereUniqueWithoutTracked_metricsInput, Prisma.metric_cardsUpdateWithWhereUniqueWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const metric_cardsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutTracked_metricsInputObjectSchema)])
}).strict();
