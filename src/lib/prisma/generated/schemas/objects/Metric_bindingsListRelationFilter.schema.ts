// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsWhereInputObjectSchema } from './metric_bindingsWhereInput.schema'

export const Metric_bindingsListRelationFilterObjectSchema: z.ZodType<Prisma.Metric_bindingsListRelationFilter, Prisma.Metric_bindingsListRelationFilter> = z.object({
  every: z.lazy(() => metric_bindingsWhereInputObjectSchema).optional(),
  some: z.lazy(() => metric_bindingsWhereInputObjectSchema).optional(),
  none: z.lazy(() => metric_bindingsWhereInputObjectSchema).optional()
}).strict();
export const Metric_bindingsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => metric_bindingsWhereInputObjectSchema).optional(),
  some: z.lazy(() => metric_bindingsWhereInputObjectSchema).optional(),
  none: z.lazy(() => metric_bindingsWhereInputObjectSchema).optional()
}).strict();
