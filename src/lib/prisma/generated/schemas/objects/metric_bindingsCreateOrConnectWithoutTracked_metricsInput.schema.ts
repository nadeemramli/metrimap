// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsWhereUniqueInputObjectSchema } from './metric_bindingsWhereUniqueInput.schema';
import { metric_bindingsCreateWithoutTracked_metricsInputObjectSchema } from './metric_bindingsCreateWithoutTracked_metricsInput.schema';
import { metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUncheckedCreateWithoutTracked_metricsInput.schema'

export const metric_bindingsCreateOrConnectWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_bindingsCreateOrConnectWithoutTracked_metricsInput, Prisma.metric_bindingsCreateOrConnectWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const metric_bindingsCreateOrConnectWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema)])
}).strict();
