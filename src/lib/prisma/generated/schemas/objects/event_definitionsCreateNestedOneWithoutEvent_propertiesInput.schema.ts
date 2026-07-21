// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsCreateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsCreateWithoutEvent_propertiesInput.schema';
import { event_definitionsUncheckedCreateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsUncheckedCreateWithoutEvent_propertiesInput.schema';
import { event_definitionsCreateOrConnectWithoutEvent_propertiesInputObjectSchema } from './event_definitionsCreateOrConnectWithoutEvent_propertiesInput.schema';
import { event_definitionsWhereUniqueInputObjectSchema } from './event_definitionsWhereUniqueInput.schema'

export const event_definitionsCreateNestedOneWithoutEvent_propertiesInputObjectSchema: z.ZodType<Prisma.event_definitionsCreateNestedOneWithoutEvent_propertiesInput, Prisma.event_definitionsCreateNestedOneWithoutEvent_propertiesInput> = z.object({
  create: z.union([z.lazy(() => event_definitionsCreateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutEvent_propertiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => event_definitionsCreateOrConnectWithoutEvent_propertiesInputObjectSchema).optional(),
  connect: z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).optional()
}).strict();
export const event_definitionsCreateNestedOneWithoutEvent_propertiesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => event_definitionsCreateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutEvent_propertiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => event_definitionsCreateOrConnectWithoutEvent_propertiesInputObjectSchema).optional(),
  connect: z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).optional()
}).strict();
