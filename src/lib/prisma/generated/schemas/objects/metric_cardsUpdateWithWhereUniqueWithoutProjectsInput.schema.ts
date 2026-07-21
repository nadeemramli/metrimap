// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateWithoutProjectsInputObjectSchema } from './metric_cardsUpdateWithoutProjectsInput.schema';
import { metric_cardsUncheckedUpdateWithoutProjectsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutProjectsInput.schema'

export const metric_cardsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateWithWhereUniqueWithoutProjectsInput, Prisma.metric_cardsUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const metric_cardsUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
