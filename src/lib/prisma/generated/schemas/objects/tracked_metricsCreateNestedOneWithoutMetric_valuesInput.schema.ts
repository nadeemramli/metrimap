// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsCreateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsCreateWithoutMetric_valuesInput.schema';
import { tracked_metricsUncheckedCreateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutMetric_valuesInput.schema';
import { tracked_metricsCreateOrConnectWithoutMetric_valuesInputObjectSchema } from './tracked_metricsCreateOrConnectWithoutMetric_valuesInput.schema';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema'

export const tracked_metricsCreateNestedOneWithoutMetric_valuesInputObjectSchema: z.ZodType<Prisma.tracked_metricsCreateNestedOneWithoutMetric_valuesInput, Prisma.tracked_metricsCreateNestedOneWithoutMetric_valuesInput> = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_valuesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutMetric_valuesInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional()
}).strict();
export const tracked_metricsCreateNestedOneWithoutMetric_valuesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_valuesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutMetric_valuesInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional()
}).strict();
