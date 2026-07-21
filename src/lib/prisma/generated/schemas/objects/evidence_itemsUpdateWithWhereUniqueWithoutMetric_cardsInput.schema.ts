// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsWhereUniqueInputObjectSchema } from './evidence_itemsWhereUniqueInput.schema';
import { evidence_itemsUpdateWithoutMetric_cardsInputObjectSchema } from './evidence_itemsUpdateWithoutMetric_cardsInput.schema';
import { evidence_itemsUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './evidence_itemsUncheckedUpdateWithoutMetric_cardsInput.schema'

export const evidence_itemsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.evidence_itemsUpdateWithWhereUniqueWithoutMetric_cardsInput, Prisma.evidence_itemsUpdateWithWhereUniqueWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const evidence_itemsUpdateWithWhereUniqueWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
