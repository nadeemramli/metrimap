// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { metric_cardsUpdateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsUpdateWithoutStrategy_metric_linksInput.schema';
import { metric_cardsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutStrategy_metric_linksInput.schema'

export const metric_cardsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateToOneWithWhereWithoutStrategy_metric_linksInput, Prisma.metric_cardsUpdateToOneWithWhereWithoutStrategy_metric_linksInput> = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)])
}).strict();
export const metric_cardsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)])
}).strict();
