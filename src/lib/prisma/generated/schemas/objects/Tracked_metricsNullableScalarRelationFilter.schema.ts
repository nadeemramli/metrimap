// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tracked_metricsWhereInputObjectSchema } from './tracked_metricsWhereInput.schema'

export const Tracked_metricsNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.Tracked_metricsNullableScalarRelationFilter, Prisma.Tracked_metricsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional().nullable()
}).strict();
export const Tracked_metricsNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => tracked_metricsWhereInputObjectSchema).optional().nullable()
}).strict();
