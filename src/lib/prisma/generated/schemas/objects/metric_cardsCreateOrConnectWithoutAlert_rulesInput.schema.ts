// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsCreateWithoutAlert_rulesInputObjectSchema } from './metric_cardsCreateWithoutAlert_rulesInput.schema';
import { metric_cardsUncheckedCreateWithoutAlert_rulesInputObjectSchema } from './metric_cardsUncheckedCreateWithoutAlert_rulesInput.schema'

export const metric_cardsCreateOrConnectWithoutAlert_rulesInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateOrConnectWithoutAlert_rulesInput, Prisma.metric_cardsCreateOrConnectWithoutAlert_rulesInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutAlert_rulesInputObjectSchema)])
}).strict();
export const metric_cardsCreateOrConnectWithoutAlert_rulesInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutAlert_rulesInputObjectSchema)])
}).strict();
