// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsCreateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsCreateWithoutMetric_valuesInput.schema';
import { tracked_metricsUncheckedCreateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsUncheckedCreateWithoutMetric_valuesInput.schema';
import { tracked_metricsCreateOrConnectWithoutMetric_valuesInputObjectSchema } from './tracked_metricsCreateOrConnectWithoutMetric_valuesInput.schema';
import { tracked_metricsUpsertWithoutMetric_valuesInputObjectSchema } from './tracked_metricsUpsertWithoutMetric_valuesInput.schema';
import { tracked_metricsWhereUniqueInputObjectSchema } from './tracked_metricsWhereUniqueInput.schema';
import { tracked_metricsUpdateToOneWithWhereWithoutMetric_valuesInputObjectSchema } from './tracked_metricsUpdateToOneWithWhereWithoutMetric_valuesInput.schema';
import { tracked_metricsUpdateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsUpdateWithoutMetric_valuesInput.schema';
import { tracked_metricsUncheckedUpdateWithoutMetric_valuesInputObjectSchema } from './tracked_metricsUncheckedUpdateWithoutMetric_valuesInput.schema'

export const tracked_metricsUpdateOneRequiredWithoutMetric_valuesNestedInputObjectSchema: z.ZodType<Prisma.tracked_metricsUpdateOneRequiredWithoutMetric_valuesNestedInput, Prisma.tracked_metricsUpdateOneRequiredWithoutMetric_valuesNestedInput> = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_valuesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutMetric_valuesInputObjectSchema).optional(),
  upsert: z.lazy(() => tracked_metricsUpsertWithoutMetric_valuesInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tracked_metricsUpdateToOneWithWhereWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUpdateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_valuesInputObjectSchema)]).optional()
}).strict();
export const tracked_metricsUpdateOneRequiredWithoutMetric_valuesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tracked_metricsCreateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedCreateWithoutMetric_valuesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tracked_metricsCreateOrConnectWithoutMetric_valuesInputObjectSchema).optional(),
  upsert: z.lazy(() => tracked_metricsUpsertWithoutMetric_valuesInputObjectSchema).optional(),
  connect: z.lazy(() => tracked_metricsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tracked_metricsUpdateToOneWithWhereWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUpdateWithoutMetric_valuesInputObjectSchema), z.lazy(() => tracked_metricsUncheckedUpdateWithoutMetric_valuesInputObjectSchema)]).optional()
}).strict();
