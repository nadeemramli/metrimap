// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsCreateWithoutEvidence_itemsInput.schema';
import { metric_cardsUncheckedCreateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutEvidence_itemsInput.schema';
import { metric_cardsCreateOrConnectWithoutEvidence_itemsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutEvidence_itemsInput.schema';
import { metric_cardsUpsertWithoutEvidence_itemsInputObjectSchema } from './metric_cardsUpsertWithoutEvidence_itemsInput.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectSchema } from './metric_cardsUpdateToOneWithWhereWithoutEvidence_itemsInput.schema';
import { metric_cardsUpdateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsUpdateWithoutEvidence_itemsInput.schema';
import { metric_cardsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutEvidence_itemsInput.schema'

export const metric_cardsUpdateOneWithoutEvidence_itemsNestedInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateOneWithoutEvidence_itemsNestedInput, Prisma.metric_cardsUpdateOneWithoutEvidence_itemsNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutEvidence_itemsInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutEvidence_itemsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)]).optional()
}).strict();
export const metric_cardsUpdateOneWithoutEvidence_itemsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutEvidence_itemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutEvidence_itemsInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutEvidence_itemsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutEvidence_itemsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutEvidence_itemsInputObjectSchema)]).optional()
}).strict();
