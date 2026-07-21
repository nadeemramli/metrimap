// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const connector_runsSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.connector_runsSumOrderByAggregateInput, Prisma.connector_runsSumOrderByAggregateInput> = z.object({
  pages: SortOrderSchema.optional(),
  fetched: SortOrderSchema.optional(),
  accepted: SortOrderSchema.optional(),
  skipped: SortOrderSchema.optional(),
  rejected: SortOrderSchema.optional(),
  materialized: SortOrderSchema.optional(),
  duration_ms: SortOrderSchema.optional()
}).strict();
export const connector_runsSumOrderByAggregateInputObjectZodSchema = z.object({
  pages: SortOrderSchema.optional(),
  fetched: SortOrderSchema.optional(),
  accepted: SortOrderSchema.optional(),
  skipped: SortOrderSchema.optional(),
  rejected: SortOrderSchema.optional(),
  materialized: SortOrderSchema.optional(),
  duration_ms: SortOrderSchema.optional()
}).strict();
