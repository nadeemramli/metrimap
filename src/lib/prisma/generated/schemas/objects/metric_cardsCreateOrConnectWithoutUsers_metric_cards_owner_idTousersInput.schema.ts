// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInput.schema';
import { metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInput.schema'

export const metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInput, Prisma.metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema)])
}).strict();
export const metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema)])
}).strict();
