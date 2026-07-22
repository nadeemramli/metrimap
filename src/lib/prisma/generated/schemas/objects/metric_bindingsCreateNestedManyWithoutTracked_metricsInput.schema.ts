// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsCreateWithoutTracked_metricsInputObjectSchema } from './metric_bindingsCreateWithoutTracked_metricsInput.schema';
import { metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUncheckedCreateWithoutTracked_metricsInput.schema';
import { metric_bindingsCreateOrConnectWithoutTracked_metricsInputObjectSchema } from './metric_bindingsCreateOrConnectWithoutTracked_metricsInput.schema';
import { metric_bindingsCreateManyTracked_metricsInputEnvelopeObjectSchema } from './metric_bindingsCreateManyTracked_metricsInputEnvelope.schema';
import { metric_bindingsWhereUniqueInputObjectSchema } from './metric_bindingsWhereUniqueInput.schema'

export const metric_bindingsCreateNestedManyWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_bindingsCreateNestedManyWithoutTracked_metricsInput, Prisma.metric_bindingsCreateNestedManyWithoutTracked_metricsInput> = z.object({
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_bindingsCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_bindingsCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const metric_bindingsCreateNestedManyWithoutTracked_metricsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_bindingsCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_bindingsCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
