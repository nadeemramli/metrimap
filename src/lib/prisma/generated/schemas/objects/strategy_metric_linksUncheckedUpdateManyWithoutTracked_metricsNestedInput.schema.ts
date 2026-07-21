// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksCreateWithoutTracked_metricsInput.schema';
import { strategy_metric_linksUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksUncheckedCreateWithoutTracked_metricsInput.schema';
import { strategy_metric_linksCreateOrConnectWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksCreateOrConnectWithoutTracked_metricsInput.schema';
import { strategy_metric_linksUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksUpsertWithWhereUniqueWithoutTracked_metricsInput.schema';
import { strategy_metric_linksCreateManyTracked_metricsInputEnvelopeObjectSchema } from './strategy_metric_linksCreateManyTracked_metricsInputEnvelope.schema';
import { strategy_metric_linksWhereUniqueInputObjectSchema } from './strategy_metric_linksWhereUniqueInput.schema';
import { strategy_metric_linksUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksUpdateWithWhereUniqueWithoutTracked_metricsInput.schema';
import { strategy_metric_linksUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema } from './strategy_metric_linksUpdateManyWithWhereWithoutTracked_metricsInput.schema';
import { strategy_metric_linksScalarWhereInputObjectSchema } from './strategy_metric_linksScalarWhereInput.schema'

export const strategy_metric_linksUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksUncheckedUpdateManyWithoutTracked_metricsNestedInput, Prisma.strategy_metric_linksUncheckedUpdateManyWithoutTracked_metricsNestedInput> = z.object({
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_metric_linksCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => strategy_metric_linksUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_metric_linksCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => strategy_metric_linksUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => strategy_metric_linksUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema), z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const strategy_metric_linksUncheckedUpdateManyWithoutTracked_metricsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_metric_linksCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => strategy_metric_linksUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_metric_linksCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => strategy_metric_linksUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => strategy_metric_linksUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema), z.lazy(() => strategy_metric_linksUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema), z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema).array()]).optional()
}).strict();
