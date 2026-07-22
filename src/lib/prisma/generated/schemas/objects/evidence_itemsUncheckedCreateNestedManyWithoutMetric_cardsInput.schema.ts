// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateWithoutMetric_cardsInputObjectSchema } from './evidence_itemsCreateWithoutMetric_cardsInput.schema';
import { evidence_itemsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutMetric_cardsInput.schema';
import { evidence_itemsCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './evidence_itemsCreateOrConnectWithoutMetric_cardsInput.schema';
import { evidence_itemsCreateManyMetric_cardsInputEnvelopeObjectSchema } from './evidence_itemsCreateManyMetric_cardsInputEnvelope.schema';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema'

export const evidence_itemsUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.evidence_itemsUncheckedCreateNestedManyWithoutMetric_cardsInput, Prisma.evidence_itemsUncheckedCreateNestedManyWithoutMetric_cardsInput> = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const evidence_itemsUncheckedCreateNestedManyWithoutMetric_cardsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => evidence_itemsUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => evidence_itemsCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => evidence_itemsCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema), z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
