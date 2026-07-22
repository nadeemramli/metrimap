// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsScalarWhereInputObjectSchema } from './metric_bindingsScalarWhereInput.schema';
import { metric_bindingsUpdateManyMutationInputObjectSchema } from './metric_bindingsUpdateManyMutationInput.schema';
import { metric_bindingsUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema } from './metric_bindingsUncheckedUpdateManyWithoutTracked_metricsInput.schema'

export const metric_bindingsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_bindingsUpdateManyWithWhereWithoutTracked_metricsInput, Prisma.metric_bindingsUpdateManyWithWhereWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => metric_bindingsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_bindingsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_bindingsUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const metric_bindingsUpdateManyWithWhereWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_bindingsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_bindingsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_bindingsUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema)])
}).strict();
