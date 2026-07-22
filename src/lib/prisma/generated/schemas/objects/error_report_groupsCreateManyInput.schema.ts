// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const error_report_groupsCreateManyInputObjectSchema: z.ZodType<Prisma.error_report_groupsCreateManyInput, Prisma.error_report_groupsCreateManyInput> = z.object({
  fingerprint: z.string(),
  title: z.string().optional().nullable(),
  first_seen_at: z.union([z.date(), z.string().datetime()]).optional(),
  last_seen_at: z.union([z.date(), z.string().datetime()]).optional(),
  occurrence_count: z.number().int().optional(),
  last_synced_count: z.number().int().optional(),
  severity: z.string().optional(),
  sample_report_id: z.string().optional().nullable(),
  linear_issue_id: z.string().optional().nullable(),
  linear_issue_identifier: z.string().optional().nullable(),
  linear_issue_url: z.string().optional().nullable(),
  sync_status: z.string().optional(),
  sync_error: z.string().optional().nullable(),
  linear_synced_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const error_report_groupsCreateManyInputObjectZodSchema = z.object({
  fingerprint: z.string(),
  title: z.string().optional().nullable(),
  first_seen_at: z.union([z.date(), z.string().datetime()]).optional(),
  last_seen_at: z.union([z.date(), z.string().datetime()]).optional(),
  occurrence_count: z.number().int().optional(),
  last_synced_count: z.number().int().optional(),
  severity: z.string().optional(),
  sample_report_id: z.string().optional().nullable(),
  linear_issue_id: z.string().optional().nullable(),
  linear_issue_identifier: z.string().optional().nullable(),
  linear_issue_url: z.string().optional().nullable(),
  sync_status: z.string().optional(),
  sync_error: z.string().optional().nullable(),
  linear_synced_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
