// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsCreateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsCreateWithoutMetric_cardsInput.schema';
import { tracked_metricsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutMetric_cardsInput.schema';
import { tracked_metricsCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './tracked_metricsCreateOrConnectWithoutMetric_cardsInput.schema';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema'

export const tracked_metricsCreateNestedOneWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.tracked_metricsCreateNestedOneWithoutMetric_cardsInput, Prisma.tracked_metricsCreateNestedOneWithoutMetric_cardsInput> = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutMetric_cardsInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional()
}).strict();
export const tracked_metricsCreateNestedOneWithoutMetric_cardsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutMetric_cardsInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional()
}).strict();
