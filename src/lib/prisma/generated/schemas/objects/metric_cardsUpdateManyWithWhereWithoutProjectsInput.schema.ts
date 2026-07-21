// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsScalarWhereInputObjectSchema } from './metric_cardsScalarWhereInput.schema';
import { metric_cardsUpdateManyMutationInputObjectSchema } from './metric_cardsUpdateManyMutationInput.schema';
import { metric_cardsUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './metric_cardsUncheckedUpdateManyWithoutProjectsInput.schema'

export const metric_cardsUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateManyWithWhereWithoutProjectsInput, Prisma.metric_cardsUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => metric_cardsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const metric_cardsUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
