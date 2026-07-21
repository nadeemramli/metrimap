// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_propertiesCreateWithoutEvent_definitionsInputObjectSchema } from './event_propertiesCreateWithoutEvent_definitionsInput.schema';
import { event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema } from './event_propertiesUncheckedCreateWithoutEvent_definitionsInput.schema';
import { event_propertiesCreateOrConnectWithoutEvent_definitionsInputObjectSchema } from './event_propertiesCreateOrConnectWithoutEvent_definitionsInput.schema';
import { event_propertiesUpsertWithWhereUniqueWithoutEvent_definitionsInputObjectSchema } from './event_propertiesUpsertWithWhereUniqueWithoutEvent_definitionsInput.schema';
import { event_propertiesCreateManyEvent_definitionsInputEnvelopeObjectSchema } from './event_propertiesCreateManyEvent_definitionsInputEnvelope.schema';
import { event_propertiesWhereUniqueInputObjectSchema } from './event_propertiesWhereUniqueInput.schema';
import { event_propertiesUpdateWithWhereUniqueWithoutEvent_definitionsInputObjectSchema } from './event_propertiesUpdateWithWhereUniqueWithoutEvent_definitionsInput.schema';
import { event_propertiesUpdateManyWithWhereWithoutEvent_definitionsInputObjectSchema } from './event_propertiesUpdateManyWithWhereWithoutEvent_definitionsInput.schema';
import { event_propertiesScalarWhereInputObjectSchema } from './event_propertiesScalarWhereInput.schema'

export const event_propertiesUncheckedUpdateManyWithoutEvent_definitionsNestedInputObjectSchema: z.ZodType<Prisma.event_propertiesUncheckedUpdateManyWithoutEvent_definitionsNestedInput, Prisma.event_propertiesUncheckedUpdateManyWithoutEvent_definitionsNestedInput> = z.object({
  create: z.union([z.lazy(() => event_propertiesCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesCreateWithoutEvent_definitionsInputObjectSchema).array(), z.lazy(() => event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => event_propertiesCreateOrConnectWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesCreateOrConnectWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => event_propertiesUpsertWithWhereUniqueWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUpsertWithWhereUniqueWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => event_propertiesCreateManyEvent_definitionsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => event_propertiesWhereUniqueInputObjectSchema), z.lazy(() => event_propertiesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => event_propertiesWhereUniqueInputObjectSchema), z.lazy(() => event_propertiesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => event_propertiesWhereUniqueInputObjectSchema), z.lazy(() => event_propertiesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => event_propertiesWhereUniqueInputObjectSchema), z.lazy(() => event_propertiesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => event_propertiesUpdateWithWhereUniqueWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUpdateWithWhereUniqueWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => event_propertiesUpdateManyWithWhereWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUpdateManyWithWhereWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => event_propertiesScalarWhereInputObjectSchema), z.lazy(() => event_propertiesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const event_propertiesUncheckedUpdateManyWithoutEvent_definitionsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => event_propertiesCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesCreateWithoutEvent_definitionsInputObjectSchema).array(), z.lazy(() => event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => event_propertiesCreateOrConnectWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesCreateOrConnectWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => event_propertiesUpsertWithWhereUniqueWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUpsertWithWhereUniqueWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => event_propertiesCreateManyEvent_definitionsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => event_propertiesWhereUniqueInputObjectSchema), z.lazy(() => event_propertiesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => event_propertiesWhereUniqueInputObjectSchema), z.lazy(() => event_propertiesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => event_propertiesWhereUniqueInputObjectSchema), z.lazy(() => event_propertiesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => event_propertiesWhereUniqueInputObjectSchema), z.lazy(() => event_propertiesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => event_propertiesUpdateWithWhereUniqueWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUpdateWithWhereUniqueWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => event_propertiesUpdateManyWithWhereWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUpdateManyWithWhereWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => event_propertiesScalarWhereInputObjectSchema), z.lazy(() => event_propertiesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
