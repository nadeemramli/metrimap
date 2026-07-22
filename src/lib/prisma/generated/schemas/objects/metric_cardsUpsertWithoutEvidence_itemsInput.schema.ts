// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsUpdateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsUpdateWithoutEvidence_itemsInput.schema';
import { metric_cardsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutEvidence_itemsInput.schema';
import { metric_cardsCreateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsCreateWithoutEvidence_itemsInput.schema';
import { metric_cardsUncheckedCreateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutEvidence_itemsInput.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema'

export const metric_cardsUpsertWithoutEvidence_itemsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpsertWithoutEvidence_itemsInput, Prisma.metric_cardsUpsertWithoutEvidence_itemsInput> = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
export const metric_cardsUpsertWithoutEvidence_itemsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
