// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsScalarWhereInputObjectSchema } from './evidence_itemsScalarWhereInput.schema';
import { evidence_itemsUpdateManyMutationInputObjectSchema } from './evidence_itemsUpdateManyMutationInput.schema';
import { evidence_itemsUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema } from './evidence_itemsUncheckedUpdateManyWithoutMetric_cardsInput.schema'

export const evidence_itemsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.evidence_itemsUpdateManyWithWhereWithoutMetric_cardsInput, Prisma.evidence_itemsUpdateManyWithWhereWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => evidence_itemsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateManyMutationInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const evidence_itemsUpdateManyWithWhereWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => evidence_itemsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => evidence_itemsUpdateManyMutationInputObjectSchema), z.lazy(() => evidence_itemsUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema)])
}).strict();
