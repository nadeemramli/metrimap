// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsCreateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsCreateWithoutMetric_bindingsInput.schema';
import { tracked_metricsUncheckedCreateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutMetric_bindingsInput.schema';
import { tracked_metricsCreateOrConnectWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsCreateOrConnectWithoutMetric_bindingsInput.schema';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema'

export const tracked_metricsCreateNestedOneWithoutMetric_bindingsInputObjectSchema: z.ZodType<Prisma.tracked_metricsCreateNestedOneWithoutMetric_bindingsInput, Prisma.tracked_metricsCreateNestedOneWithoutMetric_bindingsInput> = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutMetric_bindingsInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional()
}).strict();
export const tracked_metricsCreateNestedOneWithoutMetric_bindingsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutMetric_bindingsInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional()
}).strict();
