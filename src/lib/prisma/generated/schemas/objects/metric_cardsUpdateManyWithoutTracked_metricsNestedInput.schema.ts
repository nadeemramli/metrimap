// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutTracked_metricsInputObjectSchema } from './metric_cardsCreateWithoutTracked_metricsInput.schema';
import { metric_cardsUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutTracked_metricsInput.schema';
import { metric_cardsCreateOrConnectWithoutTracked_metricsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutTracked_metricsInput.schema';
import { metric_cardsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema } from './metric_cardsUpsertWithWhereUniqueWithoutTracked_metricsInput.schema';
import { metric_cardsCreateManyTracked_metricsInputEnvelopeObjectSchema } from './metric_cardsCreateManyTracked_metricsInputEnvelope.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema } from './metric_cardsUpdateWithWhereUniqueWithoutTracked_metricsInput.schema';
import { metric_cardsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema } from './metric_cardsUpdateManyWithWhereWithoutTracked_metricsInput.schema';
import { metric_cardsScalarWhereInputObjectSchema } from './metric_cardsScalarWhereInput.schema'

export const metric_cardsUpdateManyWithoutTracked_metricsNestedInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateManyWithoutTracked_metricsNestedInput, Prisma.metric_cardsUpdateManyWithoutTracked_metricsNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_cardsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_cardsScalarWhereInputObjectSchema), z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const metric_cardsUpdateManyWithoutTracked_metricsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_cardsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema), z.lazy(() => metric_cardsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_cardsScalarWhereInputObjectSchema), z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
