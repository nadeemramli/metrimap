// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Error_report_groupsCountAggregateInputObjectSchema: z.ZodType<Prisma.Error_report_groupsCountAggregateInputType, Prisma.Error_report_groupsCountAggregateInputType> = z.object({
  fingerprint: z.literal(true).optional(),
  title: z.literal(true).optional(),
  first_seen_at: z.literal(true).optional(),
  last_seen_at: z.literal(true).optional(),
  occurrence_count: z.literal(true).optional(),
  last_synced_count: z.literal(true).optional(),
  severity: z.literal(true).optional(),
  sample_report_id: z.literal(true).optional(),
  linear_issue_id: z.literal(true).optional(),
  linear_issue_identifier: z.literal(true).optional(),
  linear_issue_url: z.literal(true).optional(),
  sync_status: z.literal(true).optional(),
  sync_error: z.literal(true).optional(),
  linear_synced_at: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Error_report_groupsCountAggregateInputObjectZodSchema = z.object({
  fingerprint: z.literal(true).optional(),
  title: z.literal(true).optional(),
  first_seen_at: z.literal(true).optional(),
  last_seen_at: z.literal(true).optional(),
  occurrence_count: z.literal(true).optional(),
  last_synced_count: z.literal(true).optional(),
  severity: z.literal(true).optional(),
  sample_report_id: z.literal(true).optional(),
  linear_issue_id: z.literal(true).optional(),
  linear_issue_identifier: z.literal(true).optional(),
  linear_issue_url: z.literal(true).optional(),
  sync_status: z.literal(true).optional(),
  sync_error: z.literal(true).optional(),
  linear_synced_at: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
