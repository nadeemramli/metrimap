// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_valuesCreateWithoutTracked_metricsInputObjectSchema } from './metric_valuesCreateWithoutTracked_metricsInput.schema';
import { metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './metric_valuesUncheckedCreateWithoutTracked_metricsInput.schema';
import { metric_valuesCreateOrConnectWithoutTracked_metricsInputObjectSchema } from './metric_valuesCreateOrConnectWithoutTracked_metricsInput.schema';
import { metric_valuesUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema } from './metric_valuesUpsertWithWhereUniqueWithoutTracked_metricsInput.schema';
import { metric_valuesCreateManyTracked_metricsInputEnvelopeObjectSchema } from './metric_valuesCreateManyTracked_metricsInputEnvelope.schema';
import { metric_valuesWhereUniqueInputObjectSchema } from './metric_valuesWhereUniqueInput.schema';
import { metric_valuesUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema } from './metric_valuesUpdateWithWhereUniqueWithoutTracked_metricsInput.schema';
import { metric_valuesUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema } from './metric_valuesUpdateManyWithWhereWithoutTracked_metricsInput.schema';
import { metric_valuesScalarWhereInputObjectSchema } from './metric_valuesScalarWhereInput.schema'

export const metric_valuesUpdateManyWithoutTracked_metricsNestedInputObjectSchema: z.ZodType<Prisma.metric_valuesUpdateManyWithoutTracked_metricsNestedInput, Prisma.metric_valuesUpdateManyWithoutTracked_metricsNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_valuesCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_valuesCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_valuesUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_valuesCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_valuesWhereUniqueInputObjectSchema), z.lazy(() => metric_valuesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_valuesWhereUniqueInputObjectSchema), z.lazy(() => metric_valuesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_valuesWhereUniqueInputObjectSchema), z.lazy(() => metric_valuesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_valuesWhereUniqueInputObjectSchema), z.lazy(() => metric_valuesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_valuesUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_valuesUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_valuesScalarWhereInputObjectSchema), z.lazy(() => metric_valuesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const metric_valuesUpdateManyWithoutTracked_metricsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_valuesCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_valuesCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_valuesUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_valuesCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_valuesWhereUniqueInputObjectSchema), z.lazy(() => metric_valuesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_valuesWhereUniqueInputObjectSchema), z.lazy(() => metric_valuesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_valuesWhereUniqueInputObjectSchema), z.lazy(() => metric_valuesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_valuesWhereUniqueInputObjectSchema), z.lazy(() => metric_valuesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_valuesUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_valuesUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_valuesUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_valuesScalarWhereInputObjectSchema), z.lazy(() => metric_valuesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
