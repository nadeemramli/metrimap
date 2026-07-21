// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Connected_accountsMinAggregateInputObjectSchema: z.ZodType<Prisma.Connected_accountsMinAggregateInputType, Prisma.Connected_accountsMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  connector_id: z.literal(true).optional(),
  auth_type: z.literal(true).optional(),
  source_account_id: z.literal(true).optional(),
  source_account_label: z.literal(true).optional(),
  status: z.literal(true).optional(),
  status_detail: z.literal(true).optional(),
  last_synced_at: z.literal(true).optional(),
  last_query_at: z.literal(true).optional(),
  revoked_at: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const Connected_accountsMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  workspace_id: z.literal(true).optional(),
  connector_id: z.literal(true).optional(),
  auth_type: z.literal(true).optional(),
  source_account_id: z.literal(true).optional(),
  source_account_label: z.literal(true).optional(),
  status: z.literal(true).optional(),
  status_detail: z.literal(true).optional(),
  last_synced_at: z.literal(true).optional(),
  last_query_at: z.literal(true).optional(),
  revoked_at: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
