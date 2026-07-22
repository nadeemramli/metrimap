// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema';
import { tracked_metricsUpdateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsUpdateWithoutMetric_cardsInput.schema';
import { tracked_metricsUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutMetric_cardsInput.schema'

export const tracked_metricsUpdateToOneWithWhereWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpdateToOneWithWhereWithoutMetric_cardsInput, Prisma.tracked_metricsUpdateToOneWithWhereWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tracked_metricsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const tracked_metricsUpdateToOneWithWhereWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tracked_metricsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
