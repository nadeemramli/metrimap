// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsUpdateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsUpdateWithoutEvent_propertiesInput.schema';
import { event_definitionsUncheckedUpdateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsUncheckedUpdateWithoutEvent_propertiesInput.schema';
import { event_definitionsCreateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsCreateWithoutEvent_propertiesInput.schema';
import { event_definitionsUncheckedCreateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsUncheckedCreateWithoutEvent_propertiesInput.schema';
import { event_definitionsWhereInputObjectSchema } from './event_definitionsWhereInput.schema'

export const event_definitionsUpsertWithoutEvent_propertiesInputObjectSchema: z.ZodType<Prisma.event_definitionsUpsertWithoutEvent_propertiesInput, Prisma.event_definitionsUpsertWithoutEvent_propertiesInput> = z.object({
  update: z.union([z.lazy(() => event_definitionsUpdateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedUpdateWithoutEvent_propertiesInputObjectSchema)]),
  create: z.union([z.lazy(() => event_definitionsCreateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutEvent_propertiesInputObjectSchema)]),
  where: z.lazy(() => event_definitionsWhereInputObjectSchema).optional()
}).strict();
export const event_definitionsUpsertWithoutEvent_propertiesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => event_definitionsUpdateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedUpdateWithoutEvent_propertiesInputObjectSchema)]),
  create: z.union([z.lazy(() => event_definitionsCreateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutEvent_propertiesInputObjectSchema)]),
  where: z.lazy(() => event_definitionsWhereInputObjectSchema).optional()
}).strict();
