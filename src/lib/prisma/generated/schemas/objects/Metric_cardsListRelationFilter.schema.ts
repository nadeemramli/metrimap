// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema'

export const Metric_cardsListRelationFilterObjectSchema: z.ZodType<Prisma.Metric_cardsListRelationFilter, Prisma.Metric_cardsListRelationFilter> = z.object({
  every: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  some: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  none: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
export const Metric_cardsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  some: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  none: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
