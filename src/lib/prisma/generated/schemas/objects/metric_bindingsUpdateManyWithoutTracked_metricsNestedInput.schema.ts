// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsCreateWithoutTracked_metricsInputObjectSchema } from './metric_bindingsCreateWithoutTracked_metricsInput.schema';
import { metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUncheckedCreateWithoutTracked_metricsInput.schema';
import { metric_bindingsCreateOrConnectWithoutTracked_metricsInputObjectSchema } from './metric_bindingsCreateOrConnectWithoutTracked_metricsInput.schema';
import { metric_bindingsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUpsertWithWhereUniqueWithoutTracked_metricsInput.schema';
import { metric_bindingsCreateManyTracked_metricsInputEnvelopeObjectSchema } from './metric_bindingsCreateManyTracked_metricsInputEnvelope.schema';
import { metric_bindingsWhereUniqueInputObjectSchema } from './metric_bindingsWhereUniqueInput.schema';
import { metric_bindingsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUpdateWithWhereUniqueWithoutTracked_metricsInput.schema';
import { metric_bindingsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUpdateManyWithWhereWithoutTracked_metricsInput.schema';
import { metric_bindingsScalarWhereInputObjectSchema } from './metric_bindingsScalarWhereInput.schema'

export const metric_bindingsUpdateManyWithoutTracked_metricsNestedInputObjectSchema: z.ZodType<Prisma.metric_bindingsUpdateManyWithoutTracked_metricsNestedInput, Prisma.metric_bindingsUpdateManyWithoutTracked_metricsNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_bindingsCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_bindingsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_bindingsCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_bindingsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_bindingsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_bindingsScalarWhereInputObjectSchema), z.lazy(() => metric_bindingsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const metric_bindingsUpdateManyWithoutTracked_metricsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_bindingsCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_bindingsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_bindingsCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_bindingsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_bindingsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_bindingsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_bindingsScalarWhereInputObjectSchema), z.lazy(() => metric_bindingsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
