// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsCreateWithoutEvidence_itemsInput.schema';
import { metric_cardsUncheckedCreateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutEvidence_itemsInput.schema';
import { metric_cardsCreateOrConnectWithoutEvidence_itemsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutEvidence_itemsInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema'

export const metric_cardsCreateNestedOneWithoutEvidence_itemsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateNestedOneWithoutEvidence_itemsInput, Prisma.metric_cardsCreateNestedOneWithoutEvidence_itemsInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutEvidence_itemsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
export const metric_cardsCreateNestedOneWithoutEvidence_itemsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutEvidence_itemsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
