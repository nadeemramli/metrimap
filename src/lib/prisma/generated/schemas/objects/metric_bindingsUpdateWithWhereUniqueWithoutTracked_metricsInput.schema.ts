// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsWhereUniqueInputObjectSchema } from './metric_bindingsWhereUniqueInput.schema';
import { metric_bindingsUpdateWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUpdateWithoutTracked_metricsInput.schema';
import { metric_bindingsUncheckedUpdateWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUncheckedUpdateWithoutTracked_metricsInput.schema'

export const metric_bindingsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_bindingsUpdateWithWhereUniqueWithoutTracked_metricsInput, Prisma.metric_bindingsUpdateWithWhereUniqueWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_bindingsUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedUpdateWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const metric_bindingsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_bindingsUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedUpdateWithoutTracked_metricsInputObjectSchema)])
}).strict();
