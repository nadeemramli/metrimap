// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_propertiesWhereUniqueInputObjectSchema } from './event_propertiesWhereUniqueInput.schema';
import { event_propertiesUpdateWithoutEvent_definitionsInputObjectSchema } from './event_propertiesUpdateWithoutEvent_definitionsInput.schema';
import { event_propertiesUncheckedUpdateWithoutEvent_definitionsInputObjectSchema } from './event_propertiesUncheckedUpdateWithoutEvent_definitionsInput.schema';
import { event_propertiesCreateWithoutEvent_definitionsInputObjectSchema } from './event_propertiesCreateWithoutEvent_definitionsInput.schema';
import { event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema } from './event_propertiesUncheckedCreateWithoutEvent_definitionsInput.schema'

export const event_propertiesUpsertWithWhereUniqueWithoutEvent_definitionsInputObjectSchema: z.ZodType<Prisma.event_propertiesUpsertWithWhereUniqueWithoutEvent_definitionsInput, Prisma.event_propertiesUpsertWithWhereUniqueWithoutEvent_definitionsInput> = z.object({
  where: z.lazy(() => event_propertiesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => event_propertiesUpdateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUncheckedUpdateWithoutEvent_definitionsInputObjectSchema)]),
  create: z.union([z.lazy(() => event_propertiesCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema)])
}).strict();
export const event_propertiesUpsertWithWhereUniqueWithoutEvent_definitionsInputObjectZodSchema = z.object({
  where: z.lazy(() => event_propertiesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => event_propertiesUpdateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUncheckedUpdateWithoutEvent_definitionsInputObjectSchema)]),
  create: z.union([z.lazy(() => event_propertiesCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUncheckedCreateWithoutEvent_definitionsInputObjectSchema)])
}).strict();
