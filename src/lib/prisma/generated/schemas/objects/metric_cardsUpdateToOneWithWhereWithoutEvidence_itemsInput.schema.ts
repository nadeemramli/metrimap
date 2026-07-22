// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { metric_cardsUpdateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsUpdateWithoutEvidence_itemsInput.schema';
import { metric_cardsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutEvidence_itemsInput.schema'

export const metric_cardsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateToOneWithWhereWithoutEvidence_itemsInput, Prisma.metric_cardsUpdateToOneWithWhereWithoutEvidence_itemsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)])
}).strict();
export const metric_cardsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)])
}).strict();
