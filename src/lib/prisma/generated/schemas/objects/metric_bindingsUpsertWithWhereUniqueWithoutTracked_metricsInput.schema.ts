// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsWhereUniqueInputObjectSchema } from './metric_bindingsWhereUniqueInput.schema';
import { metric_bindingsUpdateWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUpdateWithoutTracked_metricsInput.schema';
import { metric_bindingsUncheckedUpdateWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUncheckedUpdateWithoutTracked_metricsInput.schema';
import { metric_bindingsCreateWithoutTracked_metricsInputObjectSchema } from './metric_bindingsCreateWithoutTracked_metricsInput.schema';
import { metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUncheckedCreateWithoutTracked_metricsInput.schema'

export const metric_bindingsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_bindingsUpsertWithWhereUniqueWithoutTracked_metricsInput, Prisma.metric_bindingsUpsertWithWhereUniqueWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => metric_bindingsUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedUpdateWithoutTracked_metricsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const metric_bindingsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => metric_bindingsUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedUpdateWithoutTracked_metricsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema)])
}).strict();
