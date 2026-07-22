// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { metric_cardsUpdateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsUpdateWithoutNode_access_grantsInput.schema';
import { metric_cardsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutNode_access_grantsInput.schema'

export const metric_cardsUpdateToOneWithWhereWithoutNode_access_grantsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateToOneWithWhereWithoutNode_access_grantsInput, Prisma.metric_cardsUpdateToOneWithWhereWithoutNode_access_grantsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema)])
}).strict();
export const metric_cardsUpdateToOneWithWhereWithoutNode_access_grantsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema)])
}).strict();
