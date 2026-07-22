// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsUpdateWithoutAlert_rulesInputObjectSchema } from './metric_cardsUpdateWithoutAlert_rulesInput.schema';
import { metric_cardsUncheckedUpdateWithoutAlert_rulesInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutAlert_rulesInput.schema';
import { metric_cardsCreateWithoutAlert_rulesInputObjectSchema } from './metric_cardsCreateWithoutAlert_rulesInput.schema';
import { metric_cardsUncheckedCreateWithoutAlert_rulesInputObjectSchema } from './metric_cardsUncheckedCreateWithoutAlert_rulesInput.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema'

export const metric_cardsUpsertWithoutAlert_rulesInputObjectSchema: z.ZodType<Prisma.metric_cardsUpsertWithoutAlert_rulesInput, Prisma.metric_cardsUpsertWithoutAlert_rulesInput> = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutAlert_rulesInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutAlert_rulesInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
export const metric_cardsUpsertWithoutAlert_rulesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutAlert_rulesInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutAlert_rulesInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
