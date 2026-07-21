// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema';
import { tracked_metricsUpdateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsUpdateWithoutMetric_valuesInput.schema';
import { tracked_metricsUncheckedUpdateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutMetric_valuesInput.schema'

export const tracked_metricsUpdateToOneWithWhereWithoutMetric_valuesInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpdateToOneWithWhereWithoutMetric_valuesInput, Prisma.tracked_metricsUpdateToOneWithWhereWithoutMetric_valuesInput> = z.object({
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tracked_metricsUpdateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_valuesInputObjectSchema)])
}).strict();
export const tracked_metricsUpdateToOneWithWhereWithoutMetric_valuesInputObjectZodSchema = z.object({
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tracked_metricsUpdateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_valuesInputObjectSchema)])
}).strict();
