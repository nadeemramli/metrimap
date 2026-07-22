// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_valuesCreateWithoutTracked_metricsInputObjectSchema } from './metric_valuesCreateWithoutTracked_metricsInput.schema';
import { metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './metric_valuesUncheckedCreateWithoutTracked_metricsInput.schema';
import { metric_valuesCreateOrConnectWithoutTracked_metricsInputObjectSchema } from './metric_valuesCreateOrConnectWithoutTracked_metricsInput.schema';
import { metric_valuesCreateManyTracked_metricsInputEnvelopeObjectSchema } from './metric_valuesCreateManyTracked_metricsInputEnvelope.schema';
import { metric_valuesWhereUniqueInputObjectSchema } from './metric_valuesWhereUniqueInput.schema'

export const metric_valuesCreateNestedManyWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_valuesCreateNestedManyWithoutTracked_metricsInput, Prisma.metric_valuesCreateNestedManyWithoutTracked_metricsInput> = z.object({
  create: z.union([z.lazy(() => metric_valuesCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_valuesCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_valuesCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_valuesWhereUniqueInputObjectSchema), z.lazy(() => metric_valuesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const metric_valuesCreateNestedManyWithoutTracked_metricsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_valuesCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_valuesCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_valuesCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_valuesWhereUniqueInputObjectSchema), z.lazy(() => metric_valuesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
