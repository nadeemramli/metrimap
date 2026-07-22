// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsUpdateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsUpdateWithoutMetric_valuesInput.schema';
import { tracked_metricsUncheckedUpdateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutMetric_valuesInput.schema';
import { tracked_metricsCreateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsCreateWithoutMetric_valuesInput.schema';
import { tracked_metricsUncheckedCreateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutMetric_valuesInput.schema';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema'

export const tracked_metricsUpsertWithoutMetric_valuesInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpsertWithoutMetric_valuesInput, Prisma.tracked_metricsUpsertWithoutMetric_valuesInput> = z.object({
  update: z.union([z.lazy(() => tracked_metricsUpdateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_valuesInputObjectSchema)]),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_valuesInputObjectSchema)]),
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional()
}).strict();
export const tracked_metricsUpsertWithoutMetric_valuesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => tracked_metricsUpdateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_valuesInputObjectSchema)]),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_valuesInputObjectSchema)]),
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional()
}).strict();
