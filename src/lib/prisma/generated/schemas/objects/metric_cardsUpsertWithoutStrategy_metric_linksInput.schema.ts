// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsUpdateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsUpdateWithoutStrategy_metric_linksInput.schema';
import { metric_cardsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutStrategy_metric_linksInput.schema';
import { metric_cardsCreateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsCreateWithoutStrategy_metric_linksInput.schema';
import { metric_cardsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsUncheckedCreateWithoutStrategy_metric_linksInput.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema'

export const metric_cardsUpsertWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.metric_cardsUpsertWithoutStrategy_metric_linksInput, Prisma.metric_cardsUpsertWithoutStrategy_metric_linksInput> = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
export const metric_cardsUpsertWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
