// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsCreateWithoutStrategy_metric_linksInput.schema';
import { metric_cardsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsUncheckedCreateWithoutStrategy_metric_linksInput.schema';
import { metric_cardsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema } from './metric_cardsCreateOrConnectWithoutStrategy_metric_linksInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema'

export const metric_cardsCreateNestedOneWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateNestedOneWithoutStrategy_metric_linksInput, Prisma.metric_cardsCreateNestedOneWithoutStrategy_metric_linksInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
export const metric_cardsCreateNestedOneWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutStrategy_metric_linksInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
