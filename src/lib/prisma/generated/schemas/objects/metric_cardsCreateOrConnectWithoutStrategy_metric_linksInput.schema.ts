// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsCreateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsCreateWithoutStrategy_metric_linksInput.schema';
import { metric_cardsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsUncheckedCreateWithoutStrategy_metric_linksInput.schema'

export const metric_cardsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateOrConnectWithoutStrategy_metric_linksInput, Prisma.metric_cardsCreateOrConnectWithoutStrategy_metric_linksInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)])
}).strict();
export const metric_cardsCreateOrConnectWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)])
}).strict();
