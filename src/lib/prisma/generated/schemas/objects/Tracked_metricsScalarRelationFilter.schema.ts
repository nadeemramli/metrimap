// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema'

export const Tracked_metricsScalarRelationFilterObjectSchema: z.ZodType<Prisma.Tracked_metricsScalarRelationFilter, Prisma.Tracked_metricsScalarRelationFilter> = z.object({
  is: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional()
}).strict();
export const Tracked_metricsScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional()
}).strict();
