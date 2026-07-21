// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsUpdateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsUpdateWithoutEvent_definitionsInput.schema';
import { tracked_metricsUncheckedUpdateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutEvent_definitionsInput.schema';
import { tracked_metricsCreateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsCreateWithoutEvent_definitionsInput.schema';
import { tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutEvent_definitionsInput.schema';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema'

export const tracked_metricsUpsertWithoutEvent_definitionsInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpsertWithoutEvent_definitionsInput, Prisma.tracked_metricsUpsertWithoutEvent_definitionsInput> = z.object({
  update: z.union([z.lazy(() => tracked_metricsUpdateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutEvent_definitionsInputObjectSchema)]),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectSchema)]),
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional()
}).strict();
export const tracked_metricsUpsertWithoutEvent_definitionsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => tracked_metricsUpdateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutEvent_definitionsInputObjectSchema)]),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectSchema)]),
  where: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional()
}).strict();
