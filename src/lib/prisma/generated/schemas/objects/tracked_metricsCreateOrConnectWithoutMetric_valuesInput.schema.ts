// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema';
import { tracked_metricsCreateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsCreateWithoutMetric_valuesInput.schema';
import { tracked_metricsUncheckedCreateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutMetric_valuesInput.schema'

export const tracked_metricsCreateOrConnectWithoutMetric_valuesInputObjectSchema: z.ZodType<Prisma.tracked_metricsCreateOrConnectWithoutMetric_valuesInput, Prisma.tracked_metricsCreateOrConnectWithoutMetric_valuesInput> = z.object({
  where: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_valuesInputObjectSchema)])
}).strict();
export const tracked_metricsCreateOrConnectWithoutMetric_valuesInputObjectZodSchema = z.object({
  where: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_valuesInputObjectSchema)])
}).strict();
