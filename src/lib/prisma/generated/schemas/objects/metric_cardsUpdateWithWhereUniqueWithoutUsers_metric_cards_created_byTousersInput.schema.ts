// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsUpdateWithoutUsers_metric_cards_created_byTousersInput.schema';
import { metric_cardsUncheckedUpdateWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutUsers_metric_cards_created_byTousersInput.schema'

export const metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInput, Prisma.metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutUsers_metric_cards_created_byTousersInputObjectSchema)])
}).strict();
export const metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutUsers_metric_cards_created_byTousersInputObjectSchema)])
}).strict();
