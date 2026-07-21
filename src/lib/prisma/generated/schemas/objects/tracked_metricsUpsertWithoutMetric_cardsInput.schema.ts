// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsUpdateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsUpdateWithoutMetric_cardsInput.schema';
import { tracked_metricsUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutMetric_cardsInput.schema';
import { tracked_metricsCreateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsCreateWithoutMetric_cardsInput.schema';
import { tracked_metricsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutMetric_cardsInput.schema';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema'

export const tracked_metricsUpsertWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpsertWithoutMetric_cardsInput, Prisma.tracked_metricsUpsertWithoutMetric_cardsInput> = z.object({
  update: z.union([z.lazy(() => tracked_metricsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]),
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional()
}).strict();
export const tracked_metricsUpsertWithoutMetric_cardsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => tracked_metricsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_cardsInputObjectSchema)]),
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional()
}).strict();
