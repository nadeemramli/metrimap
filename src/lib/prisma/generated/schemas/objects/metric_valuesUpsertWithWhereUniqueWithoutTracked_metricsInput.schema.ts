// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_valuesWhereUniqueInputObjectSchema } from './metric_valuesWhereUniqueInput.schema';
import { metric_valuesUpdateWithoutTracked_metricsInputObjectSchema } from './metric_valuesUpdateWithoutTracked_metricsInput.schema';
import { metric_valuesUncheckedUpdateWithoutTracked_metricsInputObjectSchema } from './metric_valuesUncheckedUpdateWithoutTracked_metricsInput.schema';
import { metric_valuesCreateWithoutTracked_metricsInputObjectSchema } from './metric_valuesCreateWithoutTracked_metricsInput.schema';
import { metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './metric_valuesUncheckedCreateWithoutTracked_metricsInput.schema'

export const metric_valuesUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_valuesUpsertWithWhereUniqueWithoutTracked_metricsInput, Prisma.metric_valuesUpsertWithWhereUniqueWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => metric_valuesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => metric_valuesUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUncheckedUpdateWithoutTracked_metricsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_valuesCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const metric_valuesUpsertWithWhereUniqueWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_valuesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => metric_valuesUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUncheckedUpdateWithoutTracked_metricsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_valuesCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema)])
}).strict();
