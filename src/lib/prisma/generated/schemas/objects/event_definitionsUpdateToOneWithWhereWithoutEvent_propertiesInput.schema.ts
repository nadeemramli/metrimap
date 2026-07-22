// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsWhereInputObjectSchema } from './event_definitionsWhereInput.schema';
import { event_definitionsUpdateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsUpdateWithoutEvent_propertiesInput.schema';
import { event_definitionsUncheckedUpdateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsUncheckedUpdateWithoutEvent_propertiesInput.schema'

export const event_definitionsUpdateToOneWithWhereWithoutEvent_propertiesInputObjectSchema: z.ZodType<Prisma.event_definitionsUpdateToOneWithWhereWithoutEvent_propertiesInput, Prisma.event_definitionsUpdateToOneWithWhereWithoutEvent_propertiesInput> = z.object({
  where: z.lazy(() => event_definitionsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => event_definitionsUpdateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedUpdateWithoutEvent_propertiesInputObjectSchema)])
}).strict();
export const event_definitionsUpdateToOneWithWhereWithoutEvent_propertiesInputObjectZodSchema = z.object({
  where: z.lazy(() => event_definitionsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => event_definitionsUpdateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedUpdateWithoutEvent_propertiesInputObjectSchema)])
}).strict();
