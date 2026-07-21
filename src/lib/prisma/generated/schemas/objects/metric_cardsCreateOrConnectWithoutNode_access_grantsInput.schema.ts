// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsCreateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsCreateWithoutNode_access_grantsInput.schema';
import { metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutNode_access_grantsInput.schema'

export const metric_cardsCreateOrConnectWithoutNode_access_grantsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateOrConnectWithoutNode_access_grantsInput, Prisma.metric_cardsCreateOrConnectWithoutNode_access_grantsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)])
}).strict();
export const metric_cardsCreateOrConnectWithoutNode_access_grantsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)])
}).strict();
