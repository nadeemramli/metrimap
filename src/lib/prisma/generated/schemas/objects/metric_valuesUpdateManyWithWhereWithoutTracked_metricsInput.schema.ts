// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_valuesScalarWhereInputObjectSchema } from './metric_valuesScalarWhereInput.schema';
import { metric_valuesUpdateManyMutationInputObjectSchema } from './metric_valuesUpdateManyMutationInput.schema';
import { metric_valuesUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema } from './metric_valuesUncheckedUpdateManyWithoutTracked_metricsInput.schema'

export const metric_valuesUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_valuesUpdateManyWithWhereWithoutTracked_metricsInput, Prisma.metric_valuesUpdateManyWithWhereWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => metric_valuesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_valuesUpdateManyMutationInputObjectSchema), z.lazy(() => metric_valuesUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const metric_valuesUpdateManyWithWhereWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_valuesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_valuesUpdateManyMutationInputObjectSchema), z.lazy(() => metric_valuesUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema)])
}).strict();
