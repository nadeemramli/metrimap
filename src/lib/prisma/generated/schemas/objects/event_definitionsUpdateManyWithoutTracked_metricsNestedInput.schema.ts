// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsCreateWithoutTracked_metricsInputObjectSchema } from './event_definitionsCreateWithoutTracked_metricsInput.schema';
import { event_definitionsUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './event_definitionsUncheckedCreateWithoutTracked_metricsInput.schema';
import { event_definitionsCreateOrConnectWithoutTracked_metricsInputObjectSchema } from './event_definitionsCreateOrConnectWithoutTracked_metricsInput.schema';
import { event_definitionsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema } from './event_definitionsUpsertWithWhereUniqueWithoutTracked_metricsInput.schema';
import { event_definitionsCreateManyTracked_metricsInputEnvelopeObjectSchema } from './event_definitionsCreateManyTracked_metricsInputEnvelope.schema';
import { event_definitionsWhereUniqueInputObjectSchema } from './event_definitionsWhereUniqueInput.schema';
import { event_definitionsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema } from './event_definitionsUpdateWithWhereUniqueWithoutTracked_metricsInput.schema';
import { event_definitionsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema } from './event_definitionsUpdateManyWithWhereWithoutTracked_metricsInput.schema';
import { event_definitionsScalarWhereInputObjectSchema } from './event_definitionsScalarWhereInput.schema'

export const event_definitionsUpdateManyWithoutTracked_metricsNestedInputObjectSchema: z.ZodType<Prisma.event_definitionsUpdateManyWithoutTracked_metricsNestedInput, Prisma.event_definitionsUpdateManyWithoutTracked_metricsNestedInput> = z.object({
  create: z.union([z.lazy(() => event_definitionsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => event_definitionsUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => event_definitionsCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => event_definitionsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => event_definitionsCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => event_definitionsWhereUniqueInputObjectSchema), z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => event_definitionsWhereUniqueInputObjectSchema), z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => event_definitionsWhereUniqueInputObjectSchema), z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => event_definitionsWhereUniqueInputObjectSchema), z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => event_definitionsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => event_definitionsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => event_definitionsScalarWhereInputObjectSchema), z.lazy(() => event_definitionsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const event_definitionsUpdateManyWithoutTracked_metricsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => event_definitionsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => event_definitionsUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => event_definitionsCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => event_definitionsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => event_definitionsCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => event_definitionsWhereUniqueInputObjectSchema), z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => event_definitionsWhereUniqueInputObjectSchema), z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => event_definitionsWhereUniqueInputObjectSchema), z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => event_definitionsWhereUniqueInputObjectSchema), z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => event_definitionsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => event_definitionsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => event_definitionsScalarWhereInputObjectSchema), z.lazy(() => event_definitionsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
