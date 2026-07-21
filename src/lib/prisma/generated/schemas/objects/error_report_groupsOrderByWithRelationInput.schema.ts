// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema'

export const error_report_groupsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.error_report_groupsOrderByWithRelationInput, Prisma.error_report_groupsOrderByWithRelationInput> = z.object({
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
  updated_at: SortOrderSchema.optional()
}).strict();
export const error_report_groupsOrderByWithRelationInputObjectZodSchema = z.object({
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
  updated_at: SortOrderSchema.optional()
}).strict();
