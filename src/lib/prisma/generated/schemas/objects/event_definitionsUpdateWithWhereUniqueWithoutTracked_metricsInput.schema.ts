// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsWhereUniqueInputObjectSchema } from './event_definitionsWhereUniqueInput.schema';
import { event_definitionsUpdateWithoutTracked_metricsInputObjectSchema } from './event_definitionsUpdateWithoutTracked_metricsInput.schema';
import { event_definitionsUncheckedUpdateWithoutTracked_metricsInputObjectSchema } from './event_definitionsUncheckedUpdateWithoutTracked_metricsInput.schema'

export const event_definitionsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.event_definitionsUpdateWithWhereUniqueWithoutTracked_metricsInput, Prisma.event_definitionsUpdateWithWhereUniqueWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => event_definitionsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => event_definitionsUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUncheckedUpdateWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const event_definitionsUpdateWithWhereUniqueWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => event_definitionsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => event_definitionsUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUncheckedUpdateWithoutTracked_metricsInputObjectSchema)])
}).strict();
