// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInput.schema';
import { metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInput.schema';
import { metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInput.schema';
import { metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputEnvelopeObjectSchema } from './metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputEnvelope.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema'

export const metric_cardsCreateNestedManyWithoutUsers_metric_cards_owner_idTousersInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateNestedManyWithoutUsers_metric_cards_owner_idTousersInput, Prisma.metric_cardsCreateNestedManyWithoutUsers_metric_cards_owner_idTousersInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const metric_cardsCreateNestedManyWithoutUsers_metric_cards_owner_idTousersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
