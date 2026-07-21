// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsCreateWithoutTracked_metricsInputObjectSchema } from './event_definitionsCreateWithoutTracked_metricsInput.schema';
import { event_definitionsUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './event_definitionsUncheckedCreateWithoutTracked_metricsInput.schema';
import { event_definitionsCreateOrConnectWithoutTracked_metricsInputObjectSchema } from './event_definitionsCreateOrConnectWithoutTracked_metricsInput.schema';
import { event_definitionsCreateManyTracked_metricsInputEnvelopeObjectSchema } from './event_definitionsCreateManyTracked_metricsInputEnvelope.schema';
import { event_definitionsWhereUniqueInputObjectSchema } from './event_definitionsWhereUniqueInput.schema'

export const event_definitionsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.event_definitionsUncheckedCreateNestedManyWithoutTracked_metricsInput, Prisma.event_definitionsUncheckedCreateNestedManyWithoutTracked_metricsInput> = z.object({
  create: z.union([z.lazy(() => event_definitionsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => event_definitionsUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => event_definitionsCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => event_definitionsCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => event_definitionsWhereUniqueInputObjectSchema), z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const event_definitionsUncheckedCreateNestedManyWithoutTracked_metricsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => event_definitionsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsCreateWithoutTracked_metricsInputObjectSchema).array(), z.lazy(() => event_definitionsUncheckedCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => event_definitionsCreateOrConnectWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsCreateOrConnectWithoutTracked_metricsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => event_definitionsCreateManyTracked_metricsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => event_definitionsWhereUniqueInputObjectSchema), z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
