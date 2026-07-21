// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsScalarWhereInputObjectSchema } from './event_definitionsScalarWhereInput.schema';
import { event_definitionsUpdateManyMutationInputObjectSchema } from './event_definitionsUpdateManyMutationInput.schema';
import { event_definitionsUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema } from './event_definitionsUncheckedUpdateManyWithoutTracked_metricsInput.schema'

export const event_definitionsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.event_definitionsUpdateManyWithWhereWithoutTracked_metricsInput, Prisma.event_definitionsUpdateManyWithWhereWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => event_definitionsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => event_definitionsUpdateManyMutationInputObjectSchema), z.lazy(() => event_definitionsUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const event_definitionsUpdateManyWithWhereWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => event_definitionsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => event_definitionsUpdateManyMutationInputObjectSchema), z.lazy(() => event_definitionsUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema)])
}).strict();
