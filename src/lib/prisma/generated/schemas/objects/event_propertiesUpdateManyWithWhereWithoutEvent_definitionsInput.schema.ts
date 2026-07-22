// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_propertiesScalarWhereInputObjectSchema } from './event_propertiesScalarWhereInput.schema';
import { event_propertiesUpdateManyMutationInputObjectSchema } from './event_propertiesUpdateManyMutationInput.schema';
import { event_propertiesUncheckedUpdateManyWithoutEvent_definitionsInputObjectSchema } from './event_propertiesUncheckedUpdateManyWithoutEvent_definitionsInput.schema'

export const event_propertiesUpdateManyWithWhereWithoutEvent_definitionsInputObjectSchema: z.ZodType<Prisma.event_propertiesUpdateManyWithWhereWithoutEvent_definitionsInput, Prisma.event_propertiesUpdateManyWithWhereWithoutEvent_definitionsInput> = z.object({
  where: z.lazy(() => event_propertiesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => event_propertiesUpdateManyMutationInputObjectSchema), z.lazy(() => event_propertiesUncheckedUpdateManyWithoutEvent_definitionsInputObjectSchema)])
}).strict();
export const event_propertiesUpdateManyWithWhereWithoutEvent_definitionsInputObjectZodSchema = z.object({
  where: z.lazy(() => event_propertiesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => event_propertiesUpdateManyMutationInputObjectSchema), z.lazy(() => event_propertiesUncheckedUpdateManyWithoutEvent_definitionsInputObjectSchema)])
}).strict();
