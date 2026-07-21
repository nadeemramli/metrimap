// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateWithoutMetric_cardsInputObjectSchema } from './evidence_itemsCreateWithoutMetric_cardsInput.schema';
import { evidence_itemsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutMetric_cardsInput.schema';
import { evidence_itemsCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './evidence_itemsCreateOrConnectWithoutMetric_cardsInput.schema';
import { evidence_itemsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema } from './evidence_itemsUpsertWithWhereUniqueWithoutMetric_cardsInput.schema';
import { evidence_itemsCreateManyMetric_cardsInputEnvelopeObjectSchema } from './evidence_itemsCreateManyMetric_cardsInputEnvelope.schema';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema } from './evidence_itemsUpdateWithWhereUniqueWithoutMetric_cardsInput.schema';
import { evidence_itemsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema } from './evidence_itemsUpdateManyWithWhereWithoutMetric_cardsInput.schema';
import { evidence_itemsScalarWhereInputObjectSchema } from './evidence_itemsScalarWhereInput.schema'

export const evidence_itemsUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema: z.ZodType<Prisma.evidence_itemsUncheckedUpdateManyWithoutMetric_cardsNestedInput, Prisma.evidence_itemsUncheckedUpdateManyWithoutMetric_cardsNestedInput> = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => evidence_itemsScalarWhereInputObjectSchema), z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const evidence_itemsUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => evidence_itemsScalarWhereInputObjectSchema), z.lazy(() => evidence_itemsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
