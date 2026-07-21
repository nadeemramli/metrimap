// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsUpdateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsUpdateWithoutMetric_bindingsInput.schema';
import { tracked_metricsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutMetric_bindingsInput.schema';
import { tracked_metricsCreateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsCreateWithoutMetric_bindingsInput.schema';
import { tracked_metricsUncheckedCreateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutMetric_bindingsInput.schema';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema'

export const tracked_metricsUpsertWithoutMetric_bindingsInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpsertWithoutMetric_bindingsInput, Prisma.tracked_metricsUpsertWithoutMetric_bindingsInput> = z.object({
  update: z.union([z.lazy(() => tracked_metricsUpdateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema)]),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)]),
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional()
}).strict();
export const tracked_metricsUpsertWithoutMetric_bindingsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => tracked_metricsUpdateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema)]),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)]),
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional()
}).strict();
