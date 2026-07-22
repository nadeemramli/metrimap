// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_valuesWhereUniqueInputObjectSchema } from './metric_valuesWhereUniqueInput.schema';
import { metric_valuesUpdateWithoutTracked_metricsInputObjectSchema } from './metric_valuesUpdateWithoutTracked_metricsInput.schema';
import { metric_valuesUncheckedUpdateWithoutTracked_metricsInputObjectSchema } from './metric_valuesUncheckedUpdateWithoutTracked_metricsInput.schema'

export const metric_valuesUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_valuesUpdateWithWhereUniqueWithoutTracked_metricsInput, Prisma.metric_valuesUpdateWithWhereUniqueWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => metric_valuesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_valuesUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUncheckedUpdateWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const metric_valuesUpdateWithWhereUniqueWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_valuesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_valuesUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUncheckedUpdateWithoutTracked_metricsInputObjectSchema)])
}).strict();
