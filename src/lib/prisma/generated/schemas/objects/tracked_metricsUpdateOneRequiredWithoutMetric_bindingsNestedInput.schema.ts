// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsCreateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsCreateWithoutMetric_bindingsInput.schema';
import { tracked_metricsUncheckedCreateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutMetric_bindingsInput.schema';
import { tracked_metricsCreateOrConnectWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsCreateOrConnectWithoutMetric_bindingsInput.schema';
import { tracked_metricsUpsertWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsUpsertWithoutMetric_bindingsInput.schema';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema';
import { tracked_metricsUpdateToOneWithWhereWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsUpdateToOneWithWhereWithoutMetric_bindingsInput.schema';
import { tracked_metricsUpdateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsUpdateWithoutMetric_bindingsInput.schema';
import { tracked_metricsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutMetric_bindingsInput.schema'

export const tracked_metricsUpdateOneRequiredWithoutMetric_bindingsNestedInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpdateOneRequiredWithoutMetric_bindingsNestedInput, Prisma.tracked_metricsUpdateOneRequiredWithoutMetric_bindingsNestedInput> = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutMetric_bindingsInputObjectSchema).optional(),
  upsert: z.lazy(() => tracked_metricsUpsertWithoutMetric_bindingsInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tracked_metricsUpdateToOneWithWhereWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUpdateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema)]).optional()
}).strict();
export const tracked_metricsUpdateOneRequiredWithoutMetric_bindingsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutMetric_bindingsInputObjectSchema).optional(),
  upsert: z.lazy(() => tracked_metricsUpsertWithoutMetric_bindingsInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tracked_metricsUpdateToOneWithWhereWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUpdateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema)]).optional()
}).strict();
