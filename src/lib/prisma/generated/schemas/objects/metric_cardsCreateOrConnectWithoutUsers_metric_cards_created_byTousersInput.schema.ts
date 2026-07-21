// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInput.schema';
import { metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInput.schema'

export const metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInput, Prisma.metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema)])
}).strict();
export const metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema)])
}).strict();
