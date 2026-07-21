// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const connector_runsAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.connector_runsAvgOrderByAggregateInput, Prisma.connector_runsAvgOrderByAggregateInput> = z.object({
  pages: SortOrderSchema.optional(),
  fetched: SortOrderSchema.optional(),
  accepted: SortOrderSchema.optional(),
  skipped: SortOrderSchema.optional(),
  rejected: SortOrderSchema.optional(),
  materialized: SortOrderSchema.optional(),
  duration_ms: SortOrderSchema.optional()
}).strict();
export const connector_runsAvgOrderByAggregateInputObjectZodSchema = z.object({
  pages: SortOrderSchema.optional(),
  fetched: SortOrderSchema.optional(),
  accepted: SortOrderSchema.optional(),
  skipped: SortOrderSchema.optional(),
  rejected: SortOrderSchema.optional(),
  materialized: SortOrderSchema.optional(),
  duration_ms: SortOrderSchema.optional()
}).strict();
