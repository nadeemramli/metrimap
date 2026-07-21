// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInput.schema';
import { metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInput.schema';
import { metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInput.schema';
import { metric_cardsUpsertWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsUpsertWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInput.schema';
import { metric_cardsCreateManyUsers_metric_cards_created_byTousersInputEnvelopeObjectSchema } from './metric_cardsCreateManyUsers_metric_cards_created_byTousersInputEnvelope.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInput.schema';
import { metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_created_byTousersInput.schema';
import { metric_cardsScalarWhereInputObjectSchema } from './metric_cardsScalarWhereInput.schema'

export const metric_cardsUpdateManyWithoutUsers_metric_cards_created_byTousersNestedInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateManyWithoutUsers_metric_cards_created_byTousersNestedInput, Prisma.metric_cardsUpdateManyWithoutUsers_metric_cards_created_byTousersNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyUsers_metric_cards_created_byTousersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_cardsScalarWhereInputObjectSchema), z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const metric_cardsUpdateManyWithoutUsers_metric_cards_created_byTousersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyUsers_metric_cards_created_byTousersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsUpdateManyWithWhereWithoutUsers_metric_cards_created_byTousersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_cardsScalarWhereInputObjectSchema), z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
