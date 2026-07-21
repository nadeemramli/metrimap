// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema';
import { tracked_metricsUpdateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsUpdateWithoutEvent_definitionsInput.schema';
import { tracked_metricsUncheckedUpdateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutEvent_definitionsInput.schema'

export const tracked_metricsUpdateToOneWithWhereWithoutEvent_definitionsInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpdateToOneWithWhereWithoutEvent_definitionsInput, Prisma.tracked_metricsUpdateToOneWithWhereWithoutEvent_definitionsInput> = z.object({
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tracked_metricsUpdateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutEvent_definitionsInputObjectSchema)])
}).strict();
export const tracked_metricsUpdateToOneWithWhereWithoutEvent_definitionsInputObjectZodSchema = z.object({
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tracked_metricsUpdateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutEvent_definitionsInputObjectSchema)])
}).strict();
