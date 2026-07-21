// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsCreateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsCreateWithoutEvent_propertiesInput.schema';
import { event_definitionsUncheckedCreateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsUncheckedCreateWithoutEvent_propertiesInput.schema';
import { event_definitionsCreateOrConnectWithoutEvent_propertiesInputObjectSchema } from './event_definitionsCreateOrConnectWithoutEvent_propertiesInput.schema';
import { event_definitionsUpsertWithoutEvent_propertiesInputObjectSchema } from './event_definitionsUpsertWithoutEvent_propertiesInput.schema';
import { event_definitionsWhereUniqueInputObjectSchema } from './event_definitionsWhereUniqueInput.schema';
import { event_definitionsUpdateToOneWithWhereWithoutEvent_propertiesInputObjectSchema } from './event_definitionsUpdateToOneWithWhereWithoutEvent_propertiesInput.schema';
import { event_definitionsUpdateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsUpdateWithoutEvent_propertiesInput.schema';
import { event_definitionsUncheckedUpdateWithoutEvent_propertiesInputObjectSchema } from './event_definitionsUncheckedUpdateWithoutEvent_propertiesInput.schema'

export const event_definitionsUpdateOneRequiredWithoutEvent_propertiesNestedInputObjectSchema: z.ZodType<Prisma.event_definitionsUpdateOneRequiredWithoutEvent_propertiesNestedInput, Prisma.event_definitionsUpdateOneRequiredWithoutEvent_propertiesNestedInput> = z.object({
  create: z.union([z.lazy(() => event_definitionsCreateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutEvent_propertiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => event_definitionsCreateOrConnectWithoutEvent_propertiesInputObjectSchema).optional(),
  upsert: z.lazy(() => event_definitionsUpsertWithoutEvent_propertiesInputObjectSchema).optional(),
  connect: z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => event_definitionsUpdateToOneWithWhereWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUpdateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedUpdateWithoutEvent_propertiesInputObjectSchema)]).optional()
}).strict();
export const event_definitionsUpdateOneRequiredWithoutEvent_propertiesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => event_definitionsCreateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutEvent_propertiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => event_definitionsCreateOrConnectWithoutEvent_propertiesInputObjectSchema).optional(),
  upsert: z.lazy(() => event_definitionsUpsertWithoutEvent_propertiesInputObjectSchema).optional(),
  connect: z.lazy(() => event_definitionsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => event_definitionsUpdateToOneWithWhereWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUpdateWithoutEvent_propertiesInputObjectSchema), z.lazy(() => event_definitionsUncheckedUpdateWithoutEvent_propertiesInputObjectSchema)]).optional()
}).strict();
