// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_propertiesWhereUniqueInputObjectSchema } from './event_propertiesWhereUniqueInput.schema';
import { event_propertiesUpdateWithoutEvent_definitionsInputObjectSchema } from './event_propertiesUpdateWithoutEvent_definitionsInput.schema';
import { event_propertiesUncheckedUpdateWithoutEvent_definitionsInputObjectSchema } from './event_propertiesUncheckedUpdateWithoutEvent_definitionsInput.schema'

export const event_propertiesUpdateWithWhereUniqueWithoutEvent_definitionsInputObjectSchema: z.ZodType<Prisma.event_propertiesUpdateWithWhereUniqueWithoutEvent_definitionsInput, Prisma.event_propertiesUpdateWithWhereUniqueWithoutEvent_definitionsInput> = z.object({
  where: z.lazy(() => event_propertiesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => event_propertiesUpdateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUncheckedUpdateWithoutEvent_definitionsInputObjectSchema)])
}).strict();
export const event_propertiesUpdateWithWhereUniqueWithoutEvent_definitionsInputObjectZodSchema = z.object({
  where: z.lazy(() => event_propertiesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => event_propertiesUpdateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => event_propertiesUncheckedUpdateWithoutEvent_definitionsInputObjectSchema)])
}).strict();
