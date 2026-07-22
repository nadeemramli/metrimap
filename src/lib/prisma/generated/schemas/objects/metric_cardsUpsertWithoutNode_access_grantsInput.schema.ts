// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsUpdateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsUpdateWithoutNode_access_grantsInput.schema';
import { metric_cardsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutNode_access_grantsInput.schema';
import { metric_cardsCreateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsCreateWithoutNode_access_grantsInput.schema';
import { metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutNode_access_grantsInput.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema'

export const metric_cardsUpsertWithoutNode_access_grantsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpsertWithoutNode_access_grantsInput, Prisma.metric_cardsUpsertWithoutNode_access_grantsInput> = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
export const metric_cardsUpsertWithoutNode_access_grantsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
