// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const error_report_groupsSelectObjectSchema: z.ZodType<Prisma.error_report_groupsSelect, Prisma.error_report_groupsSelect> = z.object({
  fingerprint: z.boolean().optional(),
  title: z.boolean().optional(),
  first_seen_at: z.boolean().optional(),
  last_seen_at: z.boolean().optional(),
  occurrence_count: z.boolean().optional(),
  last_synced_count: z.boolean().optional(),
  severity: z.boolean().optional(),
  sample_report_id: z.boolean().optional(),
  linear_issue_id: z.boolean().optional(),
  linear_issue_identifier: z.boolean().optional(),
  linear_issue_url: z.boolean().optional(),
  sync_status: z.boolean().optional(),
  sync_error: z.boolean().optional(),
  linear_synced_at: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional()
}).strict();
export const error_report_groupsSelectObjectZodSchema = z.object({
  fingerprint: z.boolean().optional(),
  title: z.boolean().optional(),
  first_seen_at: z.boolean().optional(),
  last_seen_at: z.boolean().optional(),
  occurrence_count: z.boolean().optional(),
  last_synced_count: z.boolean().optional(),
  severity: z.boolean().optional(),
  sample_report_id: z.boolean().optional(),
  linear_issue_id: z.boolean().optional(),
  linear_issue_identifier: z.boolean().optional(),
  linear_issue_url: z.boolean().optional(),
  sync_status: z.boolean().optional(),
  sync_error: z.boolean().optional(),
  linear_synced_at: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional()
}).strict();
