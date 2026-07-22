// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_valuesWhereInputObjectSchema } from './metric_valuesWhereInput.schema'

export const Metric_valuesListRelationFilterObjectSchema: z.ZodType<Prisma.Metric_valuesListRelationFilter, Prisma.Metric_valuesListRelationFilter> = z.object({
  every: z.lazy(() => metric_valuesWhereInputObjectSchema).optional(),
  some: z.lazy(() => metric_valuesWhereInputObjectSchema).optional(),
  none: z.lazy(() => metric_valuesWhereInputObjectSchema).optional()
}).strict();
export const Metric_valuesListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => metric_valuesWhereInputObjectSchema).optional(),
  some: z.lazy(() => metric_valuesWhereInputObjectSchema).optional(),
  none: z.lazy(() => metric_valuesWhereInputObjectSchema).optional()
}).strict();
