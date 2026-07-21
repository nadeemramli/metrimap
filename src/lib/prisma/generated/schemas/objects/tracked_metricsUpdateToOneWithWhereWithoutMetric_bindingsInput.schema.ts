// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema';
import { tracked_metricsUpdateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsUpdateWithoutMetric_bindingsInput.schema';
import { tracked_metricsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutMetric_bindingsInput.schema'

export const tracked_metricsUpdateToOneWithWhereWithoutMetric_bindingsInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpdateToOneWithWhereWithoutMetric_bindingsInput, Prisma.tracked_metricsUpdateToOneWithWhereWithoutMetric_bindingsInput> = z.object({
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tracked_metricsUpdateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema)])
}).strict();
export const tracked_metricsUpdateToOneWithWhereWithoutMetric_bindingsInputObjectZodSchema = z.object({
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tracked_metricsUpdateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema)])
}).strict();
