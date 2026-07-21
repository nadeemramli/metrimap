// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsCreateWithoutTracked_metricsInputObjectSchema } from './metric_cardsCreateWithoutTracked_metricsInput.schema';
import { metric_cardsUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutTracked_metricsInput.schema'

export const metric_cardsCreateOrConnectWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateOrConnectWithoutTracked_metricsInput, Prisma.metric_cardsCreateOrConnectWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const metric_cardsCreateOrConnectWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutTracked_metricsInputObjectSchema)])
}).strict();
