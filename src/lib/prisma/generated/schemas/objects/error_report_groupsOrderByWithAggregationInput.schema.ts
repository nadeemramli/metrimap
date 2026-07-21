// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { error_report_groupsCountOrderByAggregateInputObjectSchema } from './error_report_groupsCountOrderByAggregateInput.schema';
import { error_report_groupsAvgOrderByAggregateInputObjectSchema } from './error_report_groupsAvgOrderByAggregateInput.schema';
import { error_report_groupsMaxOrderByAggregateInputObjectSchema } from './error_report_groupsMaxOrderByAggregateInput.schema';
import { error_report_groupsMinOrderByAggregateInputObjectSchema } from './error_report_groupsMinOrderByAggregateInput.schema';
import { error_report_groupsSumOrderByAggregateInputObjectSchema } from './error_report_groupsSumOrderByAggregateInput.schema'

export const error_report_groupsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.error_report_groupsOrderByWithAggregationInput, Prisma.error_report_groupsOrderByWithAggregationInput> = z.object({
  fingerprint: SortOrderSchema.optional(),
  title: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  first_seen_at: SortOrderSchema.optional(),
  last_seen_at: SortOrderSchema.optional(),
  occurrence_count: SortOrderSchema.optional(),
  last_synced_count: SortOrderSchema.optional(),
  severity: SortOrderSchema.optional(),
  sample_report_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  linear_issue_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  linear_issue_identifier: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  linear_issue_url: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sync_status: SortOrderSchema.optional(),
  sync_error: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  linear_synced_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => error_report_groupsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => error_report_groupsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => error_report_groupsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => error_report_groupsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => error_report_groupsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const error_report_groupsOrderByWithAggregationInputObjectZodSchema = z.object({
  fingerprint: SortOrderSchema.optional(),
  title: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  first_seen_at: SortOrderSchema.optional(),
  last_seen_at: SortOrderSchema.optional(),
  occurrence_count: SortOrderSchema.optional(),
  last_synced_count: SortOrderSchema.optional(),
  severity: SortOrderSchema.optional(),
  sample_report_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  linear_issue_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  linear_issue_identifier: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  linear_issue_url: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sync_status: SortOrderSchema.optional(),
  sync_error: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  linear_synced_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => error_report_groupsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => error_report_groupsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => error_report_groupsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => error_report_groupsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => error_report_groupsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
