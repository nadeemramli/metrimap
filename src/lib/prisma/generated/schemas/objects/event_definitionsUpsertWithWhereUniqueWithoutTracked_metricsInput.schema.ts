// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_definitionsWhereUniqueInputObjectSchema } from './event_definitionsWhereUniqueInput.schema';
import { event_definitionsUpdateWithoutTracked_metricsInputObjectSchema } from './event_definitionsUpdateWithoutTracked_metricsInput.schema';
import { event_definitionsUncheckedUpdateWithoutTracked_metricsInputObjectSchema } from './event_definitionsUncheckedUpdateWithoutTracked_metricsInput.schema';
import { event_definitionsCreateWithoutTracked_metricsInputObjectSchema } from './event_definitionsCreateWithoutTracked_metricsInput.schema';
import { event_definitionsUncheckedCreateWithoutTracked_metricsInputObjectSchema } from './event_definitionsUncheckedCreateWithoutTracked_metricsInput.schema'

export const event_definitionsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.event_definitionsUpsertWithWhereUniqueWithoutTracked_metricsInput, Prisma.event_definitionsUpsertWithWhereUniqueWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => event_definitionsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => event_definitionsUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUncheckedUpdateWithoutTracked_metricsInputObjectSchema)]),
  create: z.union([z.lazy(() => event_definitionsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const event_definitionsUpsertWithWhereUniqueWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => event_definitionsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => event_definitionsUpdateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUncheckedUpdateWithoutTracked_metricsInputObjectSchema)]),
  create: z.union([z.lazy(() => event_definitionsCreateWithoutTracked_metricsInputObjectSchema), z.lazy(() => event_definitionsUncheckedCreateWithoutTracked_metricsInputObjectSchema)])
}).strict();
