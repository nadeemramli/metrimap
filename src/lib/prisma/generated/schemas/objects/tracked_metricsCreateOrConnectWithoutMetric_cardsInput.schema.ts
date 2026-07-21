// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema';
import { tracked_metricsCreateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsCreateWithoutMetric_cardsInput.schema';
import { tracked_metricsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutMetric_cardsInput.schema'

export const tracked_metricsCreateOrConnectWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.tracked_metricsCreateOrConnectWithoutMetric_cardsInput, Prisma.tracked_metricsCreateOrConnectWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const tracked_metricsCreateOrConnectWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
