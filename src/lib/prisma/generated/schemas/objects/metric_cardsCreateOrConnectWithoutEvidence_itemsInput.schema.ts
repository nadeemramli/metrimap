// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsCreateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsCreateWithoutEvidence_itemsInput.schema';
import { metric_cardsUncheckedCreateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutEvidence_itemsInput.schema'

export const metric_cardsCreateOrConnectWithoutEvidence_itemsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateOrConnectWithoutEvidence_itemsInput, Prisma.metric_cardsCreateOrConnectWithoutEvidence_itemsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)])
}).strict();
export const metric_cardsCreateOrConnectWithoutEvidence_itemsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)])
}).strict();
