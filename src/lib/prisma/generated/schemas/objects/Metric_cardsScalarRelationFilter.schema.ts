// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema'

export const Metric_cardsScalarRelationFilterObjectSchema: z.ZodType<Prisma.Metric_cardsScalarRelationFilter, Prisma.Metric_cardsScalarRelationFilter> = z.object({
  is: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
export const Metric_cardsScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
