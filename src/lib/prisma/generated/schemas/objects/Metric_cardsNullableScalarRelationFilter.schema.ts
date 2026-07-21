// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema'

export const Metric_cardsNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.Metric_cardsNullableScalarRelationFilter, Prisma.Metric_cardsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => metric_cardsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => metric_cardsWhereInputObjectSchema).optional().nullable()
}).strict();
export const Metric_cardsNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => metric_cardsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => metric_cardsWhereInputObjectSchema).optional().nullable()
}).strict();
