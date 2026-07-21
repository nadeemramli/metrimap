// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInput.schema';
import { metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInput.schema';
import { metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInput.schema';
import { metric_cardsUpsertWithWhereUniqueWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsUpsertWithWhereUniqueWithoutUsers_metric_cards_owner_idTousersInput.schema';
import { metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputEnvelopeObjectSchema } from './metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputEnvelope.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_owner_idTousersInput.schema';
import { metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_owner_idTousersInput.schema';
import { metric_cardsScalarWhereInputObjectSchema } from './metric_cardsScalarWhereInput.schema'

export const metric_cardsUpdateManyWithoutUsers_metric_cards_owner_idTousersNestedInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateManyWithoutUsers_metric_cards_owner_idTousersNestedInput, Prisma.metric_cardsUpdateManyWithoutUsers_metric_cards_owner_idTousersNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_cardsScalarWhereInputObjectSchema), z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const metric_cardsUpdateManyWithoutUsers_metric_cards_owner_idTousersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_owner_idTousersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_cardsScalarWhereInputObjectSchema), z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
