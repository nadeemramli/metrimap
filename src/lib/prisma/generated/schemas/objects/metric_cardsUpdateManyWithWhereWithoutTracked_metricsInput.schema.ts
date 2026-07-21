// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsScalarWhereInputObjectSchema } from './metric_cardsScalarWhereInput.schema';
import { metric_cardsUpdateManyMutationInputObjectSchema } from './metric_cardsUpdateManyMutationInput.schema';
import { metric_cardsUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema } from './metric_cardsUncheckedUpdateManyWithoutTracked_metricsInput.schema'

export const metric_cardsUpdateManyWithWhereWithoutTracked_metricsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateManyWithWhereWithoutTracked_metricsInput, Prisma.metric_cardsUpdateManyWithWhereWithoutTracked_metricsInput> = z.object({
  where: z.lazy(() => metric_cardsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema)])
}).strict();
export const metric_cardsUpdateManyWithWhereWithoutTracked_metricsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateManyWithoutTracked_metricsInputObjectSchema)])
}).strict();
