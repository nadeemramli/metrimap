// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_propertiesWhereUniqueInputObjectSchema } from './event_propertiesWhereUniqueInput.schema';
import { event_propertiesCreateWithoutEvent_definitionsInputObjectSchema } from './event_propertiesCreateWithoutEvent_definitionsInput.schema';
import { event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema } from './event_propertiesUncheckedCreateWithoutEvent_definitionsInput.schema'

export const event_propertiesCreateOrConnectWithoutEvent_definitionsInputObjectSchema: z.ZodType<Prisma.event_propertiesCreateOrConnectWithoutEvent_definitionsInput, Prisma.event_propertiesCreateOrConnectWithoutEvent_definitionsInput> = z.object({
  where: z.lazy(() => event_propertiesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => event_propertiesCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema)])
}).strict();
export const event_propertiesCreateOrConnectWithoutEvent_definitionsInputObjectZodSchema = z.object({
  where: z.lazy(() => event_propertiesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => event_propertiesCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema)])
}).strict();
