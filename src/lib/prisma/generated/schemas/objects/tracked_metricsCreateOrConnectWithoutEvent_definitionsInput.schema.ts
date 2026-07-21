// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema';
import { tracked_metricsCreateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsCreateWithoutEvent_definitionsInput.schema';
import { tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutEvent_definitionsInput.schema'

export const tracked_metricsCreateOrConnectWithoutEvent_definitionsInputObjectSchema: z.ZodType<Prisma.tracked_metricsCreateOrConnectWithoutEvent_definitionsInput, Prisma.tracked_metricsCreateOrConnectWithoutEvent_definitionsInput> = z.object({
  where: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectSchema)])
}).strict();
export const tracked_metricsCreateOrConnectWithoutEvent_definitionsInputObjectZodSchema = z.object({
  where: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectSchema)])
}).strict();
