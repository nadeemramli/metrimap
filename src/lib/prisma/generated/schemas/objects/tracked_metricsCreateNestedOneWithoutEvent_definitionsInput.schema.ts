// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsCreateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsCreateWithoutEvent_definitionsInput.schema';
import { tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutEvent_definitionsInput.schema';
import { tracked_metricsCreateOrConnectWithoutEvent_definitionsInputObjectSchema } from './tracked_metricsCreateOrConnectWithoutEvent_definitionsInput.schema';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema'

export const tracked_metricsCreateNestedOneWithoutEvent_definitionsInputObjectSchema: z.ZodType<Prisma.tracked_metricsCreateNestedOneWithoutEvent_definitionsInput, Prisma.tracked_metricsCreateNestedOneWithoutEvent_definitionsInput> = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutEvent_definitionsInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional()
}).strict();
export const tracked_metricsCreateNestedOneWithoutEvent_definitionsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutEvent_definitionsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutEvent_definitionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutEvent_definitionsInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional()
}).strict();
