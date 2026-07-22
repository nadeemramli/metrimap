// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateWithoutProjectsInputObjectSchema } from './metric_cardsUpdateWithoutProjectsInput.schema';
import { metric_cardsUncheckedUpdateWithoutProjectsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutProjectsInput.schema';
import { metric_cardsCreateWithoutProjectsInputObjectSchema } from './metric_cardsCreateWithoutProjectsInput.schema';
import { metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutProjectsInput.schema'

export const metric_cardsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpsertWithWhereUniqueWithoutProjectsInput, Prisma.metric_cardsUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const metric_cardsUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
