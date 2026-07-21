// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInput.schema';
import { metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInput.schema';
import { metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInput.schema';
import { metric_cardsCreateManyUsers_metric_cards_created_byTousersInputEnvelopeObjectSchema } from './metric_cardsCreateManyUsers_metric_cards_created_byTousersInputEnvelope.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema'

export const metric_cardsCreateNestedManyWithoutUsers_metric_cards_created_byTousersInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateNestedManyWithoutUsers_metric_cards_created_byTousersInput, Prisma.metric_cardsCreateNestedManyWithoutUsers_metric_cards_created_byTousersInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyUsers_metric_cards_created_byTousersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const metric_cardsCreateNestedManyWithoutUsers_metric_cards_created_byTousersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyUsers_metric_cards_created_byTousersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
