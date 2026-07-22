// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsCreateWithoutNode_access_grantsInput.schema';
import { metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutNode_access_grantsInput.schema';
import { metric_cardsCreateOrConnectWithoutNode_access_grantsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutNode_access_grantsInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema'

export const metric_cardsCreateNestedOneWithoutNode_access_grantsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateNestedOneWithoutNode_access_grantsInput, Prisma.metric_cardsCreateNestedOneWithoutNode_access_grantsInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutNode_access_grantsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
export const metric_cardsCreateNestedOneWithoutNode_access_grantsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutNode_access_grantsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
