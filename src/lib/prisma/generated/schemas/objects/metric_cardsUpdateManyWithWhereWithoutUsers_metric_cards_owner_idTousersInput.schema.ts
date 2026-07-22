// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsScalarWhereInputObjectSchema } from './metric_cardsScalarWhereInput.schema';
import { metric_cardsUpdateManyMutationInputObjectSchema } from './metric_cardsUpdateManyMutationInput.schema';
import { metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_owner_idTousersInput.schema'

export const metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_owner_idTousersInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_owner_idTousersInput, Prisma.metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_owner_idTousersInput> = z.object({
  where: z.lazy(() => metric_cardsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_owner_idTousersInputObjectSchema)])
}).strict();
export const metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_owner_idTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_cardsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateManyWithoutUsers_metric_cards_owner_idTousersInputObjectSchema)])
}).strict();
