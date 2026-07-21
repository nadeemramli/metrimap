// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsCreateWithoutMetric_cardsInputObjectSchema } from './evidence_itemsCreateWithoutMetric_cardsInput.schema';
import { evidence_itemsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './evidence_itemsUncheckedCreateWithoutMetric_cardsInput.schema'

export const evidence_itemsCreateOrConnectWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.evidence_itemsCreateOrConnectWithoutMetric_cardsInput, Prisma.evidence_itemsCreateOrConnectWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const evidence_itemsCreateOrConnectWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => evidence_itemsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
