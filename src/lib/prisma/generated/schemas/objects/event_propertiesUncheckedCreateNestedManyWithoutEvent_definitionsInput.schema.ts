// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_propertiesCreateWithoutEvent_definitionsInputObjectSchema } from './event_propertiesCreateWithoutEvent_definitionsInput.schema';
import { event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema } from './event_propertiesUncheckedCreateWithoutEvent_definitionsInput.schema';
import { event_propertiesCreateOrConnectWithoutEvent_definitionsInputObjectSchema } from './event_propertiesCreateOrConnectWithoutEvent_definitionsInput.schema';
import { event_propertiesCreateManyEvent_definitionsInputEnvelopeObjectSchema } from './event_propertiesCreateManyEvent_definitionsInputEnvelope.schema';
import { event_propertiesWhereUniqueInputObjectSchema } from './event_propertiesWhereUniqueInput.schema'

export const event_propertiesUncheckedCreateNestedManyWithoutEvent_definitionsInputObjectSchema: z.ZodType<Prisma.event_propertiesUncheckedCreateNestedManyWithoutEvent_definitionsInput, Prisma.event_propertiesUncheckedCreateNestedManyWithoutEvent_definitionsInput> = z.object({
  create: z.union([z.lazy(() => event_propertiesCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesCreateWithoutEvent_definitionsInputObjectSchema).array(), z.lazy(() => event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => event_propertiesCreateOrConnectWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesCreateOrConnectWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => event_propertiesCreateManyEvent_definitionsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => event_propertiesWhereUniqueInputObjectSchema), z.lazy(() => event_propertiesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const event_propertiesUncheckedCreateNestedManyWithoutEvent_definitionsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => event_propertiesCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesCreateWithoutEvent_definitionsInputObjectSchema).array(), z.lazy(() => event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => event_propertiesCreateOrConnectWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesCreateOrConnectWithoutEvent_definitionsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => event_propertiesCreateManyEvent_definitionsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => event_propertiesWhereUniqueInputObjectSchema), z.lazy(() => event_propertiesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
