// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const error_report_groupsSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.error_report_groupsSumOrderByAggregateInput, Prisma.error_report_groupsSumOrderByAggregateInput> = z.object({
  occurrence_count: SortOrderSchema.optional(),
  last_synced_count: SortOrderSchema.optional()
}).strict();
export const error_report_groupsSumOrderByAggregateInputObjectZodSchema = z.object({
  occurrence_count: SortOrderSchema.optional(),
  last_synced_count: SortOrderSchema.optional()
}).strict();
