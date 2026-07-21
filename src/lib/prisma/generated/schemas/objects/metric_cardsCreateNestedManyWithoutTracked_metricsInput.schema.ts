// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutTracked_metricsInputObjectSchema } from './metric_cardsCreateWithoutTracked_metricsInput.schema';
import { metric_cardsUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutTracked_metricsInput.schema';
import { metric_cardsCreateOrConnectWithoutTracked_metricsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutTracked_metricsInput.schema';
import { metric_cardsCreateManyTracked_metricsInputEnvelopeObjectSchema } from './metric_cardsCreateManyTracked_metricsInputEnvelope.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema'

export const metric_cardsCreateNestedManyWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateNestedManyWithoutTracked_metricsInput, Prisma.metric_cardsCreateNestedManyWithoutTracked_metricsInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const metric_cardsCreateNestedManyWithoutTracked_metricsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
