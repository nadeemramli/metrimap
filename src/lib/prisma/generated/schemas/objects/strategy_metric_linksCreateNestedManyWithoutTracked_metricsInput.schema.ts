// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksCreateWithoutTracked_metricsInput.schema';
import { strategy_metric_linksUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksUncheckedCreateWithoutTracked_metricsInput.schema';
import { strategy_metric_linksCreateOrConnectWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksCreateOrConnectWithoutTracked_metricsInput.schema';
import { strategy_metric_linksCreateManyTracked_metricsInputEnvelopeObjectSchema } from './strategy_metric_linksCreateManyTracked_metricsInputEnvelope.schema';
import { strategy_metric_linksWhereUniqueInputObjectSchema } from './strategy_metric_linksWhereUniqueInput.schema'

export const strategy_metric_linksCreateNestedManyWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksCreateNestedManyWithoutTracked_metricsInput, Prisma.strategy_metric_linksCreateNestedManyWithoutTracked_metricsInput> = z.object({
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_metric_linksCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_metric_linksCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const strategy_metric_linksCreateNestedManyWithoutTracked_metricsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_metric_linksCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_metric_linksCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
