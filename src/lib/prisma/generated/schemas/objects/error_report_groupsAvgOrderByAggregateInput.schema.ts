// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const error_report_groupsAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.error_report_groupsAvgOrderByAggregateInput, Prisma.error_report_groupsAvgOrderByAggregateInput> = z.object({
  occurrence_count: SortOrderSchema.optional(),
  last_synced_count: SortOrderSchema.optional()
}).strict();
export const error_report_groupsAvgOrderByAggregateInputObjectZodSchema = z.object({
  occurrence_count: SortOrderSchema.optional(),
  last_synced_count: SortOrderSchema.optional()
}).strict();
