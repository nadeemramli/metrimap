// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsCreateWithoutMetric_cardsInputObjectSchema } from './node_access_grantsCreateWithoutMetric_cardsInput.schema';
import { node_access_grantsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './node_access_grantsUncheckedCreateWithoutMetric_cardsInput.schema';
import { node_access_grantsCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './node_access_grantsCreateOrConnectWithoutMetric_cardsInput.schema';
import { node_access_grantsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema } from './node_access_grantsUpsertWithWhereUniqueWithoutMetric_cardsInput.schema';
import { node_access_grantsCreateManyMetric_cardsInputEnvelopeObjectSchema } from './node_access_grantsCreateManyMetric_cardsInputEnvelope.schema';
import { node_access_grantsWhereUniqueInputObjectSchema } from './node_access_grantsWhereUniqueInput.schema';
import { node_access_grantsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema } from './node_access_grantsUpdateWithWhereUniqueWithoutMetric_cardsInput.schema';
import { node_access_grantsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema } from './node_access_grantsUpdateManyWithWhereWithoutMetric_cardsInput.schema';
import { node_access_grantsScalarWhereInputObjectSchema } from './node_access_grantsScalarWhereInput.schema'

export const node_access_grantsUpdateManyWithoutMetric_cardsNestedInputObjectSchema: z.ZodType<Prisma.node_access_grantsUpdateManyWithoutMetric_cardsNestedInput, Prisma.node_access_grantsUpdateManyWithoutMetric_cardsNestedInput> = z.object({
  create: z.union([z.lazy(() => node_access_grantsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => node_access_grantsUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => node_access_grantsCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => node_access_grantsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => node_access_grantsCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => node_access_grantsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => node_access_grantsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => node_access_grantsScalarWhereInputObjectSchema), z.lazy(() => node_access_grantsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const node_access_grantsUpdateManyWithoutMetric_cardsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => node_access_grantsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => node_access_grantsUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => node_access_grantsCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => node_access_grantsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => node_access_grantsCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => node_access_grantsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => node_access_grantsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => node_access_grantsScalarWhereInputObjectSchema), z.lazy(() => node_access_grantsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
