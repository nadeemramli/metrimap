// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutAlert_rulesInputObjectSchema } from './metric_cardsCreateWithoutAlert_rulesInput.schema';
import { metric_cardsUncheckedCreateWithoutAlert_rulesInputObjectSchema } from './metric_cardsUncheckedCreateWithoutAlert_rulesInput.schema';
import { metric_cardsCreateOrConnectWithoutAlert_rulesInputObjectSchema } from './metric_cardsCreateOrConnectWithoutAlert_rulesInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema'

export const metric_cardsCreateNestedOneWithoutAlert_rulesInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateNestedOneWithoutAlert_rulesInput, Prisma.metric_cardsCreateNestedOneWithoutAlert_rulesInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutAlert_rulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutAlert_rulesInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
export const metric_cardsCreateNestedOneWithoutAlert_rulesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutAlert_rulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutAlert_rulesInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
