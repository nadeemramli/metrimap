// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { metric_cardsUpdateWithoutAlert_rulesInputObjectSchema } from './metric_cardsUpdateWithoutAlert_rulesInput.schema';
import { metric_cardsUncheckedUpdateWithoutAlert_rulesInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutAlert_rulesInput.schema'

export const metric_cardsUpdateToOneWithWhereWithoutAlert_rulesInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateToOneWithWhereWithoutAlert_rulesInput, Prisma.metric_cardsUpdateToOneWithWhereWithoutAlert_rulesInput> = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutAlert_rulesInputObjectSchema)])
}).strict();
export const metric_cardsUpdateToOneWithWhereWithoutAlert_rulesInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutAlert_rulesInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutAlert_rulesInputObjectSchema)])
}).strict();
