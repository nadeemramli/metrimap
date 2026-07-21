// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsCreateWithoutProjectsInputObjectSchema } from './metric_cardsCreateWithoutProjectsInput.schema';
import { metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutProjectsInput.schema'

export const metric_cardsCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateOrConnectWithoutProjectsInput, Prisma.metric_cardsCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const metric_cardsCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
