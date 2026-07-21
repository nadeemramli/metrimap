// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema';
import { tracked_metricsCreateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsCreateWithoutMetric_bindingsInput.schema';
import { tracked_metricsUncheckedCreateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutMetric_bindingsInput.schema'

export const tracked_metricsCreateOrConnectWithoutMetric_bindingsInputObjectSchema: z.ZodType<Prisma.tracked_metricsCreateOrConnectWithoutMetric_bindingsInput, Prisma.tracked_metricsCreateOrConnectWithoutMetric_bindingsInput> = z.object({
  where: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)])
}).strict();
export const tracked_metricsCreateOrConnectWithoutMetric_bindingsInputObjectZodSchema = z.object({
  where: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)])
}).strict();
