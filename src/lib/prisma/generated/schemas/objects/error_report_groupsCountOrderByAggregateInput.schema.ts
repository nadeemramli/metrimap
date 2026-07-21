// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const error_report_groupsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.error_report_groupsCountOrderByAggregateInput, Prisma.error_report_groupsCountOrderByAggregateInput> = z.object({
  fingerprint: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  first_seen_at: SortOrderSchema.optional(),
  last_seen_at: SortOrderSchema.optional(),
  occurrence_count: SortOrderSchema.optional(),
  last_synced_count: SortOrderSchema.optional(),
  severity: SortOrderSchema.optional(),
  sample_report_id: SortOrderSchema.optional(),
  linear_issue_id: SortOrderSchema.optional(),
  linear_issue_identifier: SortOrderSchema.optional(),
  linear_issue_url: SortOrderSchema.optional(),
  sync_status: SortOrderSchema.optional(),
  sync_error: SortOrderSchema.optional(),
  linear_synced_at: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const error_report_groupsCountOrderByAggregateInputObjectZodSchema = z.object({
  fingerprint: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  first_seen_at: SortOrderSchema.optional(),
  last_seen_at: SortOrderSchema.optional(),
  occurrence_count: SortOrderSchema.optional(),
  last_synced_count: SortOrderSchema.optional(),
  severity: SortOrderSchema.optional(),
  sample_report_id: SortOrderSchema.optional(),
  linear_issue_id: SortOrderSchema.optional(),
  linear_issue_identifier: SortOrderSchema.optional(),
  linear_issue_url: SortOrderSchema.optional(),
  sync_status: SortOrderSchema.optional(),
  sync_error: SortOrderSchema.optional(),
  linear_synced_at: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
