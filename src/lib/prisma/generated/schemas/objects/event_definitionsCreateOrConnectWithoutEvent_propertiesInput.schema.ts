// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsWhereUniqueInputObjectSchema } from './event_definitionsWhereUniqueInput.schema';
import { event_definitionsCreateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsCreateWithoutEvent_propertiesInput.schema';
import { event_definitionsUncheckedCreateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsUncheckedCreateWithoutEvent_propertiesInput.schema'

export const event_definitionsCreateOrConnectWithoutEvent_propertiesInputObjectSchema: z.ZodType<Prisma.event_definitionsCreateOrConnectWithoutEvent_propertiesInput, Prisma.event_definitionsCreateOrConnectWithoutEvent_propertiesInput> = z.object({
  where: z.lazy(() => event_definitionsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => event_definitionsCreateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutEvent_propertiesInputObjectSchema)])
}).strict();
export const event_definitionsCreateOrConnectWithoutEvent_propertiesInputObjectZodSchema = z.object({
  where: z.lazy(() => event_definitionsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => event_definitionsCreateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutEvent_propertiesInputObjectSchema)])
}).strict();
