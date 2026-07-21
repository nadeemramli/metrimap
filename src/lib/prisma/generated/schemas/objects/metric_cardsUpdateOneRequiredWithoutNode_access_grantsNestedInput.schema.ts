// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsCreateWithoutNode_access_grantsInput.schema';
import { metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutNode_access_grantsInput.schema';
import { metric_cardsCreateOrConnectWithoutNode_access_grantsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutNode_access_grantsInput.schema';
import { metric_cardsUpsertWithoutNode_access_grantsInputObjectSchema } from './metric_cardsUpsertWithoutNode_access_grantsInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateToOneWithWhereWithoutNode_access_grantsInputObjectSchema } from './metric_cardsUpdateToOneWithWhereWithoutNode_access_grantsInput.schema';
import { metric_cardsUpdateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsUpdateWithoutNode_access_grantsInput.schema';
import { metric_cardsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutNode_access_grantsInput.schema'

export const metric_cardsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateOneRequiredWithoutNode_access_grantsNestedInput, Prisma.metric_cardsUpdateOneRequiredWithoutNode_access_grantsNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutNode_access_grantsInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutNode_access_grantsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema)]).optional()
}).strict();
export const metric_cardsUpdateOneRequiredWithoutNode_access_grantsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutNode_access_grantsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutNode_access_grantsInputObjectSchema).optional(),
  upsert: z.lazy(() => metric_cardsUpsertWithoutNode_access_grantsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateToOneWithWhereWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithoutNode_access_grantsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutNode_access_grantsInputObjectSchema)]).optional()
}).strict();
