// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsScalarWhereInputObjectSchema } from './metric_cardsScalarWhereInput.schema';
import { metric_cardsUpdateManyMutationInputObjectSchema } from './metric_cardsUpdateManyMutationInput.schema';
import { metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_created_byTousersInput.schema'

export const metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_created_byTousersInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_created_byTousersInput, Prisma.metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_created_byTousersInput> = z.object({
  where: z.lazy(() => metric_cardsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_created_byTousersInputObjectSchema)])
}).strict();
export const metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_created_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_created_byTousersInputObjectSchema)])
}).strict();
